// Carnet IFSI — événements Stripe de l'abonnement mensuel : paiement, renouvellement, échec, résiliation.
// Adresse à déclarer dans Stripe › Développeurs › Webhooks :
//   https://<projet>.supabase.co/functions/v1/stripe-webhook
// Événements : checkout.session.completed, customer.subscription.created, customer.subscription.updated,
//              customer.subscription.deleted, invoice.paid, invoice.payment_failed
// Cette fonction se déploie SANS vérification du jeton Supabase (« Enforce JWT verification » désactivé) :
// Stripe signe chaque envoi, la signature est vérifiée ici avec STRIPE_WEBHOOK_SECRET.
// Secrets : STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (whsec_…). SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont fournis.

const env = (k: string) => Deno.env.get(k) ?? "";
/* Après la fin d'une période, quelques jours de grâce pendant que Stripe retente un paiement refusé */
const GRACE = 3 * 86400;

async function stripe(path: string) {
  const r = await fetch("https://api.stripe.com/v1/" + path, { headers: { Authorization: `Bearer ${env("STRIPE_SECRET_KEY")}` } });
  const d = await r.json();
  if (!r.ok) throw new Error(d?.error?.message ?? "Erreur Stripe");
  return d;
}
async function rpc(fn: string, args: Record<string, unknown>) {
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  const headers: Record<string, string> = { apikey: key, "Content-Type": "application/json" };
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;
  const r = await fetch(`${env("SUPABASE_URL")}/rest/v1/rpc/${fn}`, { method: "POST", headers, body: JSON.stringify(args) });
  const t = await r.text();
  if (!r.ok) throw new Error(t);
  return t ? JSON.parse(t) : null;
}

/* Signature Stripe : en-tête « t=…,v1=… », HMAC-SHA256 de « t.corps » avec le secret du webhook, 5 minutes de tolérance */
export async function verify(payload: string, header: string, secret = env("STRIPE_WEBHOOK_SECRET"), now = Date.now() / 1000) {
  const parts = header.split(",").map((p) => p.split("="));
  const t = Number(parts.find(([k]) => k === "t")?.[1]);
  const sigs = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!secret || !t || !sigs.length || Math.abs(now - t) > 300) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = Array.from(new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(`${t}.${payload}`))))
    .map((b) => b.toString(16).padStart(2, "0")).join("");
  const same = (a: string, b: string) => a.length === b.length && [...a].reduce((d, c, i) => d | (c.charCodeAt(0) ^ b.charCodeAt(i)), 0) === 0;
  return sigs.some((s) => same(s, mac));
}

// deno-lint-ignore no-explicit-any
type Sub = any;
/* Fin de la période payée (selon la version de l'API Stripe, au niveau de l'abonnement ou de ses lignes) */
const periodEnd = (s: Sub): number | null =>
  s.current_period_end ?? (s.items?.data ?? []).reduce((m: number, i: Sub) => Math.max(m, i.current_period_end ?? 0), 0) ?? null;

/* Accès donné par un abonnement : jusqu'à la fin de la période payée (+ grâce), ou jusqu'à sa fin s'il est terminé */
export function accessFrom(s: Sub, now = Date.now() / 1000) {
  const st: string = s.status, end = periodEnd(s);
  let fin: number | null = null;
  if (["active", "trialing", "past_due"].includes(st) && end) fin = end + GRACE;
  else if (["canceled", "unpaid", "incomplete_expired"].includes(st)) fin = s.ended_at ?? s.canceled_at ?? now;
  return {
    statut: st,
    fin: fin ? new Date(fin * 1000).toISOString() : null,
    resilie: !!s.cancel_at_period_end || !!s.cancel_at || st === "canceled",
  };
}

async function apply(s: Sub) {
  const user: string | null = s.metadata?.user_id || (await rpc("compte_stripe", { p_client: s.customer }));
  if (!user) return;
  const a = accessFrom(s);
  await rpc("maj_abonnement_stripe", { p_user: user, p_abonnement: s.id, p_statut: a.statut, p_fin: a.fin, p_resilie: a.resilie });
}

export async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return new Response("methode", { status: 405 });
  const payload = await req.text();
  if (!(await verify(payload, req.headers.get("Stripe-Signature") ?? ""))) return new Response("signature", { status: 400 });
  const ev = JSON.parse(payload), o = ev.data?.object ?? {};
  try {
    if (ev.type.startsWith("customer.subscription.")) await apply(o);
    else if (ev.type === "checkout.session.completed" && o.subscription) {
      if (o.client_reference_id && o.customer) await rpc("client_stripe", { p_user: o.client_reference_id, p_client: o.customer });
      await apply(await stripe("subscriptions/" + o.subscription));
    } else if (ev.type === "invoice.paid" || ev.type === "invoice.payment_failed") {
      const id = o.subscription ?? o.parent?.subscription_details?.subscription;
      if (id) await apply(await stripe("subscriptions/" + id));
    }
  } catch (e) {
    console.error(e);
    return new Response("erreur", { status: 500 }); // Stripe renverra l'événement plus tard
  }
  return new Response("ok");
}

/* En test (CARNET_TEST=1), le gestionnaire est seulement exporté */
if (!Deno.env.get("CARNET_TEST")) Deno.serve(handler);
