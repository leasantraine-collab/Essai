-- Carnet IFSI — comptes, abonnements et codes d'accès.
-- À exécuter une seule fois dans Supabase : SQL Editor › New query › coller ce fichier › Run.
-- (Le relancer est sans danger : rien n'est effacé, la clé des contenus n'est créée qu'une fois.)

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Abonnement de chaque compte : date de fin de l'accès aux contenus réservés
-- ---------------------------------------------------------------------------
create table if not exists public.abonnements (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  jusqu_au  timestamptz not null,
  maj       timestamptz not null default now()
);
alter table public.abonnements enable row level security;
drop policy if exists "lire son abonnement" on public.abonnements;
create policy "lire son abonnement" on public.abonnements for select to authenticated using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Codes d'accès (vendus ou offerts) : chaque code ajoute des jours d'abonnement
-- ---------------------------------------------------------------------------
create table if not exists public.codes (
  code              text primary key,
  jours             int  not null check (jours > 0),
  utilisations_max  int  not null default 1 check (utilisations_max > 0),
  utilisations      int  not null default 0,
  valable_jusqu_au  timestamptz,
  note              text,
  cree_le           timestamptz not null default now()
);
alter table public.codes enable row level security;          -- aucune règle : invisible depuis l'appli

create table if not exists public.codes_utilises (
  code     text not null references public.codes(code) on delete cascade,
  user_id  uuid not null references auth.users(id) on delete cascade,
  le       timestamptz not null default now(),
  primary key (code, user_id)
);
alter table public.codes_utilises enable row level security; -- aucune règle : invisible depuis l'appli

-- ---------------------------------------------------------------------------
-- Clé de déchiffrement des contenus réservés : jamais lisible directement,
-- remise seulement aux comptes dont l'abonnement est en cours (fonction cle_contenus)
-- ---------------------------------------------------------------------------
create table if not exists public.secrets (
  nom     text primary key,
  valeur  text not null
);
alter table public.secrets enable row level security;        -- aucune règle : invisible depuis l'appli
revoke all on public.secrets from anon, authenticated;
insert into public.secrets(nom, valeur)
  values ('cle_contenus', encode(extensions.gen_random_bytes(32), 'base64'))
  on conflict (nom) do nothing;

-- ---------------------------------------------------------------------------
-- Fonctions appelées par l'appli (compte connecté)
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Abonnement mensuel payé par carte (Stripe) : renouvelé chaque mois sauf résiliation.
-- L'accès va jusqu'à la plus tardive des deux dates : codes / jours offerts, ou fin de la période payée.
-- ---------------------------------------------------------------------------
alter table public.abonnements alter column jusqu_au drop not null;
alter table public.abonnements add column if not exists stripe_abonnement text;
alter table public.abonnements add column if not exists stripe_statut      text;
alter table public.abonnements add column if not exists stripe_jusqu_au   timestamptz;
alter table public.abonnements add column if not exists stripe_resilie    boolean not null default false;

create table if not exists public.stripe_clients (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  client   text not null unique
);
alter table public.stripe_clients enable row level security;   -- aucune règle : invisible depuis l'appli

-- Date de fin de l'accès du compte connecté (null : version gratuite)
create or replace function public.mon_acces() returns timestamptz
language sql stable security definer set search_path = public as $$
  select greatest(jusqu_au, stripe_jusqu_au) from public.abonnements where user_id = auth.uid();
$$;

-- État détaillé pour l'écran « Mon compte »
create or replace function public.mon_abonnement() returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'jusqu_au', greatest(a.jusqu_au, a.stripe_jusqu_au),
    'codes_jusqu_au', a.jusqu_au,
    'mensuel', a.stripe_abonnement is not null and a.stripe_statut in ('active','trialing','past_due') and a.stripe_jusqu_au > now(),
    'statut', a.stripe_statut,
    'periode_fin', a.stripe_jusqu_au,
    'resilie', a.stripe_resilie,
    'client', exists (select 1 from public.stripe_clients c where c.user_id = a.user_id))
  from public.abonnements a where a.user_id = auth.uid();
$$;

-- Utiliser un code d'accès : ajoute ses jours à l'abonnement (à partir d'aujourd'hui ou de la fin en cours)
create or replace function public.utiliser_code(p_code text) returns timestamptz
language plpgsql security definer set search_path = public as $$
declare
  c   public.codes;
  uid uuid := auth.uid();
  fin timestamptz;
begin
  if uid is null then raise exception 'non_connecte'; end if;
  select * into c from public.codes where code = upper(replace(trim(p_code), ' ', '')) for update;
  if not found then raise exception 'code_inconnu'; end if;
  if c.valable_jusqu_au is not null and c.valable_jusqu_au < now() then raise exception 'code_expire'; end if;
  if exists (select 1 from public.codes_utilises where code = c.code and user_id = uid) then raise exception 'code_deja_utilise'; end if;
  if c.utilisations >= c.utilisations_max then raise exception 'code_epuise'; end if;
  update public.codes set utilisations = utilisations + 1 where code = c.code;
  insert into public.codes_utilises(code, user_id) values (c.code, uid);
  insert into public.abonnements(user_id, jusqu_au) values (uid, now() + make_interval(days => c.jours))
    on conflict (user_id) do update
      set jusqu_au = greatest(public.abonnements.jusqu_au, now()) + make_interval(days => c.jours), maj = now()
    returning jusqu_au into fin;
  return fin;
end $$;

-- Clé des contenus réservés, seulement si l'abonnement est en cours
create or replace function public.cle_contenus() returns json
language plpgsql stable security definer set search_path = public as $$
declare fin timestamptz;
begin
  if auth.uid() is null then raise exception 'non_connecte'; end if;
  select greatest(jusqu_au, stripe_jusqu_au) into fin from public.abonnements where user_id = auth.uid();
  if fin is null or fin < now() then raise exception 'pas_abonne'; end if;
  return json_build_object('k', (select valeur from public.secrets where nom = 'cle_contenus'), 'u', fin);
end $$;

-- Supprimer son compte et tout ce qui s'y rattache (droit à l'effacement)
create or replace function public.supprimer_mon_compte() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'non_connecte'; end if;
  -- Un abonnement mensuel en cours doit d'abord être résilié (sinon les prélèvements continueraient)
  if exists (select 1 from public.abonnements where user_id = auth.uid() and stripe_abonnement is not null
             and stripe_statut in ('active','trialing','past_due') and not stripe_resilie) then
    raise exception 'abonnement_actif';
  end if;
  delete from auth.users where id = auth.uid();
end $$;

revoke all on function public.mon_acces()              from public, anon;
revoke all on function public.mon_abonnement()         from public, anon;
grant execute on function public.mon_abonnement()       to authenticated;
revoke all on function public.utiliser_code(text)       from public, anon;
revoke all on function public.cle_contenus()            from public, anon;
revoke all on function public.supprimer_mon_compte()    from public, anon;
grant execute on function public.mon_acces()            to authenticated;
grant execute on function public.utiliser_code(text)     to authenticated;
grant execute on function public.cle_contenus()          to authenticated;
grant execute on function public.supprimer_mon_compte()  to authenticated;

-- ---------------------------------------------------------------------------
-- Pour vous seulement (SQL Editor) : créer des codes d'accès
--   select * from public.creer_codes(20, 365, 1, 'Promo rentrée');   -- 20 codes d'un an, un compte chacun
--   select * from public.creer_codes(1, 30, 50, 'Essai IFSI X', 60);  -- 1 code de 30 jours pour 50 comptes, valable 60 jours
-- ---------------------------------------------------------------------------
create or replace function public.creer_codes(n int, jours int, utilisations_max int default 1, note text default null, valable_jours int default null)
returns setof text
language plpgsql security definer set search_path = public as $$
declare
  alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';   -- sans 0/O, 1/I/L pour éviter les confusions
  b bytea; c text; i int; j int;
begin
  for i in 1..n loop
    loop
      b := extensions.gen_random_bytes(8); c := '';
      for j in 0..7 loop
        c := c || substr(alphabet, (get_byte(b, j) % length(alphabet)) + 1, 1);
        if j = 3 then c := c || '-'; end if;
      end loop;
      c := 'IFSI-' || c;
      exit when not exists (select 1 from public.codes where code = c);
    end loop;
    insert into public.codes(code, jours, utilisations_max, note, valable_jusqu_au)
      values (c, jours, utilisations_max, note, case when valable_jours is null then null else now() + make_interval(days => valable_jours) end);
    return next c;
  end loop;
end $$;
revoke all on function public.creer_codes(int, int, int, text, int) from public, anon, authenticated;

-- Offrir ou prolonger un abonnement à la main (par adresse e-mail)
--   select public.offrir_jours('etudiante@exemple.fr', 30);
create or replace function public.offrir_jours(email text, jours int) returns timestamptz
language plpgsql security definer set search_path = public, auth as $$
declare uid uuid; fin timestamptz;
begin
  select id into uid from auth.users where lower(auth.users.email) = lower(offrir_jours.email);
  if uid is null then raise exception 'compte_inconnu'; end if;
  insert into public.abonnements(user_id, jusqu_au) values (uid, now() + make_interval(days => jours))
    on conflict (user_id) do update
      set jusqu_au = greatest(public.abonnements.jusqu_au, now()) + make_interval(days => jours), maj = now()
    returning jusqu_au into fin;
  return fin;
end $$;
revoke all on function public.offrir_jours(text, int) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Réservé aux fonctions serveur (supabase/functions) : clé « service_role »
-- ---------------------------------------------------------------------------

-- Client Stripe d'un compte : le lit, ou l'enregistre s'il est fourni
create or replace function public.client_stripe(p_user uuid, p_client text default null) returns text
language plpgsql security definer set search_path = public as $$
declare c text;
begin
  select client into c from public.stripe_clients where user_id = p_user;
  if c is null and p_client is not null then
    insert into public.stripe_clients(user_id, client) values (p_user, p_client)
      on conflict (user_id) do update set client = excluded.client returning client into c;
  end if;
  return c;
end $$;

-- Compte d'un client Stripe
create or replace function public.compte_stripe(p_client text) returns uuid
language sql stable security definer set search_path = public as $$
  select user_id from public.stripe_clients where client = p_client;
$$;

-- Mise à jour de l'abonnement mensuel à chaque événement Stripe (création, renouvellement, résiliation, échec de paiement)
create or replace function public.maj_abonnement_stripe(p_user uuid, p_abonnement text, p_statut text, p_fin timestamptz, p_resilie boolean)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from auth.users where id = p_user) then return; end if;
  insert into public.abonnements(user_id, jusqu_au, stripe_abonnement, stripe_statut, stripe_jusqu_au, stripe_resilie)
    values (p_user, null, p_abonnement, p_statut, p_fin, coalesce(p_resilie, false))
    on conflict (user_id) do update
      set stripe_abonnement = excluded.stripe_abonnement, stripe_statut = excluded.stripe_statut,
          stripe_jusqu_au = excluded.stripe_jusqu_au, stripe_resilie = excluded.stripe_resilie, maj = now();
end $$;

revoke all on function public.client_stripe(uuid, text)                                   from public, anon, authenticated;
revoke all on function public.compte_stripe(text)                                         from public, anon, authenticated;
revoke all on function public.maj_abonnement_stripe(uuid, text, text, timestamptz, boolean) from public, anon, authenticated;
grant execute on function public.client_stripe(uuid, text)                                   to service_role;
grant execute on function public.compte_stripe(text)                                         to service_role;
grant execute on function public.maj_abonnement_stripe(uuid, text, text, timestamptz, boolean) to service_role;
