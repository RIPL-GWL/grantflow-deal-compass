create table public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  state text not null,
  area text,
  district text,
  address text,
  phone text,
  store_type text not null default 'retail',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.stores to anon, authenticated;
grant insert, update, delete on public.stores to authenticated;
grant all on public.stores to service_role;
alter table public.stores enable row level security;
create policy "Public reads active stores" on public.stores for select to anon, authenticated
  using (is_active or is_admin(auth.uid()) or has_role(auth.uid(), 'store_manager'));
create policy "Store managers add stores" on public.stores for insert to authenticated
  with check (is_admin(auth.uid()) or has_role(auth.uid(), 'store_manager'));
create policy "Store managers edit stores" on public.stores for update to authenticated
  using (is_admin(auth.uid()) or has_role(auth.uid(), 'store_manager'))
  with check (is_admin(auth.uid()) or has_role(auth.uid(), 'store_manager'));
create policy "Store managers remove stores" on public.stores for delete to authenticated
  using (is_admin(auth.uid()) or has_role(auth.uid(), 'store_manager'));

create table public.staff_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lead_types text[] not null default '{}',
  states text[] not null default '{}',
  priority integer not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.staff_assignments to authenticated;
grant insert, update, delete on public.staff_assignments to authenticated;
grant all on public.staff_assignments to service_role;
alter table public.staff_assignments enable row level security;
create policy "Staff read assignments" on public.staff_assignments for select to authenticated
  using (can_manage_leads(auth.uid()) or user_id = auth.uid());
create policy "Lead managers add assignments" on public.staff_assignments for insert to authenticated
  with check (can_manage_leads(auth.uid()));
create policy "Lead managers edit assignments" on public.staff_assignments for update to authenticated
  using (can_manage_leads(auth.uid())) with check (can_manage_leads(auth.uid()));
create policy "Lead managers remove assignments" on public.staff_assignments for delete to authenticated
  using (can_manage_leads(auth.uid()));

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text not null default 'all',
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
grant select on public.announcements to authenticated;
grant insert, update, delete on public.announcements to authenticated;
grant all on public.announcements to service_role;
alter table public.announcements enable row level security;
create policy "Signed-in users read announcements" on public.announcements for select to authenticated using (true);
create policy "Admins add announcements" on public.announcements for insert to authenticated
  with check (is_admin(auth.uid()) or has_role(auth.uid(), 'content_editor'));
create policy "Admins edit announcements" on public.announcements for update to authenticated
  using (is_admin(auth.uid()) or has_role(auth.uid(), 'content_editor'))
  with check (is_admin(auth.uid()) or has_role(auth.uid(), 'content_editor'));
create policy "Admins remove announcements" on public.announcements for delete to authenticated
  using (is_admin(auth.uid()) or has_role(auth.uid(), 'content_editor'));

alter table public.crm_deals add column partner_id uuid;
comment on column public.crm_deals.partner_id is 'Partner portal user who can view this deal';
create policy "Partners read own deals" on public.crm_deals for select to authenticated
  using (partner_id = auth.uid() and has_role(auth.uid(), 'partner'));
create policy "Partners read docs of own deals" on public.crm_documents for select to authenticated
  using (exists (select 1 from public.crm_deals d where d.id = crm_documents.deal_id and d.partner_id = auth.uid()));

alter table public.employees add column user_id uuid;
comment on column public.employees.user_id is 'Linked auth account for the employee portal';
create policy "Employees read own record" on public.employees for select to authenticated
  using (user_id = auth.uid());

create or replace function public.auto_assign_lead() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  st text;
  assignee uuid;
begin
  st := coalesce(new.details->>'state', new.details->>'State', '');
  select a.user_id into assignee
  from public.staff_assignments a
  where (cardinality(a.lead_types) = 0 or new.lead_type = any(a.lead_types))
    and (cardinality(a.states) = 0 or st = any(a.states))
  order by (case when st <> '' and st = any(a.states) then 1 else 0 end) desc,
           (case when new.lead_type = any(a.lead_types) then 1 else 0 end) desc,
           a.priority desc, random()
  limit 1;
  if assignee is not null then new.assigned_to := assignee; end if;
  return new;
end $$;

drop policy "Anyone can submit a lead" on public.leads;
create policy "Anyone can submit a lead" on public.leads for insert to anon, authenticated
  with check (
    lead_type = any (array['manufacturer','retailer','distributor','funding','global','general','contact'])
    and char_length(name) between 2 and 120
    and char_length(email) between 5 and 200
    and char_length(phone) between 7 and 20
    and coalesce(char_length(message), 0) <= 4000
    and status = 'new'
    and (assigned_to is null or exists (select 1 from public.staff_assignments a where a.user_id = assigned_to))
  );

create trigger leads_auto_assign before insert on public.leads
  for each row execute function public.auto_assign_lead();