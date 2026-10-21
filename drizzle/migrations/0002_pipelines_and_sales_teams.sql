CREATE TABLE public.crm_pipelines (
  key text PRIMARY KEY,
  name text NOT NULL,
  description text,
  members uuid[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_pipelines TO authenticated;
GRANT ALL ON public.crm_pipelines TO service_role;
ALTER TABLE public.crm_pipelines ENABLE ROW LEVEL SECURITY;
CREATE POLICY pipelines_read ON public.crm_pipelines FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY pipelines_manage ON public.crm_pipelines FOR ALL TO authenticated USING (public.is_sales_manager(auth.uid())) WITH CHECK (public.is_sales_manager(auth.uid()));
INSERT INTO public.crm_pipelines (key, name, sort_order) VALUES
 ('general','General',1),('manufacturer','Manufacturers',2),('retailer','Retailers',3),
 ('distributor','Distributors',4),('funding','Funding',5),('global','Global Markets',6)
ON CONFLICT (key) DO NOTHING;

CREATE TABLE public.sales_team_members (
  user_id uuid PRIMARY KEY,
  team_leader_id uuid,
  manager_id uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales_team_members TO authenticated;
GRANT ALL ON public.sales_team_members TO service_role;
ALTER TABLE public.sales_team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY team_read ON public.sales_team_members FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY team_manage ON public.sales_team_members FOR ALL TO authenticated USING (public.is_sales_manager(auth.uid())) WITH CHECK (public.is_sales_manager(auth.uid()));

CREATE OR REPLACE FUNCTION public.leads_team_of(_viewer uuid, _member uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.sales_team_members t
    WHERE t.user_id = _member AND (t.team_leader_id = _viewer OR t.manager_id = _viewer))
$$;

DROP POLICY IF EXISTS deals_read ON public.crm_deals;
CREATE POLICY deals_read ON public.crm_deals FOR SELECT TO authenticated USING (
  owner_id = auth.uid() OR public.can_view_sales(auth.uid()) OR public.leads_team_of(auth.uid(), owner_id)
  OR (partner_id = auth.uid() AND public.has_role(auth.uid(), 'partner'::app_role)));
DROP POLICY IF EXISTS deals_edit ON public.crm_deals;
CREATE POLICY deals_edit ON public.crm_deals FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() OR public.is_sales_manager(auth.uid()) OR public.leads_team_of(auth.uid(), owner_id))
  WITH CHECK (owner_id = auth.uid() OR public.is_sales_manager(auth.uid()) OR public.leads_team_of(auth.uid(), owner_id));
DROP POLICY IF EXISTS targets_read ON public.crm_targets;
CREATE POLICY targets_read ON public.crm_targets FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR public.can_view_sales(auth.uid()) OR public.leads_team_of(auth.uid(), user_id));
