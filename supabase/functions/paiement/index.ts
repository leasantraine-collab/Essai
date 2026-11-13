// Carnet IFSI — abonnement mensuel : page de paiement Stripe (Checkout) et espace client (carte, factures, résiliation).
// Appelée par l'appli, compte connecté : POST { action: "abonner" | "gerer" }  →  { url }
// Secrets à définir dans Supabase › Edge Functions › Secrets :
//   STRIPE_SECRET_KEY  clé secrète Stripe (sk_live_… ou sk_test_…)
//   STRIPE_PRICE_ID    identifiant du prix mensuel (price_…)
//   SITE_URL           adresse du site, ex. https://leasantraine-collab.github.io/Essai
// SUPABASE_URL, SUPABASE_ANON_KEY et SUPABASE_SERVICE_ROLE_KEY sont fournis automatiquement par Supabase.

const env = (k: string) => Deno.env.get(k) ?? "";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...CORS, "Content-Type": "application/json" } });

/* Paramètres Stripe (format formulaire, objets imbriqués : a[b][c]=…) */
function form(o: Record<string, unknown>, prefix = "", out = new URLSearchParams()) {
  for (const [k, v] of Object.entries(o)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === "object") form(v as Record<string, unknown>, key, out);
    else out.append(key, String(v));
  }
  return out;
}
async function stripe(method: string, path: string, params?: Record<string, unknown>) {
  const r = await fetch("https://api.stripe.com/v1/" + path, {
    method,
    headers: { Authorization: `Bearer ${env("STRIPE_SECRET_KEY")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: params ? form(params) : undefined,
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d?.error?.message ?? "Erreur Stripe");
  return d;
}
/* Fonctions SQL réservées au serveur (voir supabase/schema.sql) */
async function rpc(fn: string, args: Record<string, unknown>) {
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  const headers: Record<string, string> = { apikey: key, "Content-Type": "application/json" };
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;
  const r = await fetch(`${env("SUPABASE_URL")}/rest/v1/rpc/${fn}`, { method: "POST", headers, body: JSON.stringify(args) });
  const t = await r.text();
  if (!r.ok) throw new Error(t);
  return t ? JSON.parse(t) : null;
}

export async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "methode" }, 405);
  try {
    /* Compte connecté */
    const u = await fetch(`${env("SUPABASE_URL")}/auth/v1/user`, {
      headers: { Authorization: req.headers.get("Authorization") ?? "", apikey: env("SUPABASE_ANON_KEY") },
    });
    if (!u.ok) return json({ error: "non_connecte" }, 401);
    const user = await u.json();
    const { action } = await req.json().catch(() => ({ action: "abonner" }));
    const site = env("SITE_URL").replace(/\/$/, "");

    /* Client Stripe du compte (créé au premier paiement) */
    let client: string | null = await rpc("client_stripe", { p_user: user.id });
    if (!client) {
      const c = await stripe("POST", "customers", { email: user.email, metadata: { user_id: user.id } });
      client = await rpc("client_stripe", { p_user: user.id, p_client: c.id });
    }
    const portail = async () =>
      (await stripe("POST", "billing_portal/sessions", { customer: client, locale: "fr", return_url: `${site}/#compte` })).url;

    if (action === "gerer") return json({ url: await portail() });

    /* Déjà abonné : l'espace client plutôt qu'un second abonnement */
    const subs = await stripe("GET", `subscriptions?customer=${encodeURIComponent(client!)}&status=all&limit=10`);
    if (subs.data.some((s: { status: string }) => ["active", "trialing", "past_due"].includes(s.status)))
      return json({ url: await portail(), deja: true });

    const s = await stripe("POST", "checkout/sessions", {
      mode: "subscription",
      customer: client,
      client_reference_id: user.id,
      locale: "fr",
      line_items: { 0: { price: env("STRIPE_PRICE_ID"), quantity: 1 } },
      subscription_data: { metadata: { user_id: user.id } },
      allow_promotion_codes: "true",
      success_url: `${site}/?paiement=ok#compte`,
      cancel_url: `${site}/#compte`,
      consent_collection: { terms_of_service: "required" },
      custom_text: {
        terms_of_service_acceptance: {
          message: `J'accepte les [conditions de vente](${site}/#legal/cgu) et je demande l'accès immédiat aux contenus : je renonce à mon droit de rétractation de 14 jours pour la période en cours. L'abonnement se renouvelle chaque mois ; je peux le résilier à tout moment depuis Réglages › Mon compte.`,
        },
      },
    });
    return json({ url: s.url });
  } catch (e) {
    console.error(e);
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
}

/* En test (CARNET_TEST=1), le gestionnaire est seulement exporté */
if (!Deno.env.get("CARNET_TEST")) Deno.serve(handler);
