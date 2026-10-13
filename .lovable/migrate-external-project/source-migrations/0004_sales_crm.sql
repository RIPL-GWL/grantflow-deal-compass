CREATE OR REPLACE FUNCTION public.is_sales_manager(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','admin','lead_manager'))
$$;
CREATE OR REPLACE FUNCTION public.can_view_sales(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','admin','lead_manager','viewer'))
$$;
CREATE OR REPLACE FUNCTION public.is_sales_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','admin','lead_manager','sales_executive','store_manager','funding_manager','global_manager'))
$$;

CREATE TABLE public.crm_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 200),
  company text, contact_name text, phone text, email text,
  value numeric(14,2) NOT NULL DEFAULT 0 CHECK (value >= 0),
  pipeline text NOT NULL DEFAULT 'general' CHECK (pipeline IN ('manufacturer','retailer','distributor','funding','global','general')),
  stage text NOT NULL DEFAULT 'new' CHECK (stage IN ('new','qualified','proposal','negotiation','won','lost')),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  expected_close date,
  notes text,
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX crm_deals_owner_idx ON public.crm_deals(owner_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_deals TO authenticated;
GRANT ALL ON public.crm_deals TO service_role;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own or all for managers" ON public.crm_deals FOR SELECT TO authenticated USING (owner_id = auth.uid() OR public.can_view_sales(auth.uid()));
CREATE POLICY "Sales staff create deals" ON public.crm_deals FOR INSERT TO authenticated WITH CHECK (public.is_sales_staff(auth.uid()) AND (owner_id = auth.uid() OR public.is_sales_manager(auth.uid())));
CREATE POLICY "Owner or manager updates deals" ON public.crm_deals FOR UPDATE TO authenticated USING (owner_id = auth.uid() OR public.is_sales_manager(auth.uid())) WITH CHECK (public.is_sales_manager(auth.uid()) OR owner_id = auth.uid());
CREATE POLICY "Managers delete deals" ON public.crm_deals FOR DELETE TO authenticated USING (public.is_sales_manager(auth.uid()));

CREATE OR REPLACE FUNCTION public.crm_deal_touch() RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  NEW.updated_at := now();
  IF NEW.stage IN ('won','lost') AND (TG_OP = 'INSERT' OR OLD.stage NOT IN ('won','lost')) THEN NEW.closed_at := now();
  ELSIF NEW.stage NOT IN ('won','lost') THEN NEW.closed_at := NULL; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER crm_deals_touch BEFORE INSERT OR UPDATE ON public.crm_deals FOR EACH ROW EXECUTE FUNCTION public.crm_deal_touch();

CREATE TABLE public.crm_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  month date NOT NULL,
  target_value numeric(14,2) NOT NULL CHECK (target_value >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, month)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_targets TO authenticated;
GRANT ALL ON public.crm_targets TO service_role;
ALTER TABLE public.crm_targets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own or all targets" ON public.crm_targets FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.can_view_sales(auth.uid()));
CREATE POLICY "Managers add targets" ON public.crm_targets FOR INSERT TO authenticated WITH CHECK (public.is_sales_manager(auth.uid()));
CREATE POLICY "Managers edit targets" ON public.crm_targets FOR UPDATE TO authenticated USING (public.is_sales_manager(auth.uid())) WITH CHECK (public.is_sales_manager(auth.uid()));
CREATE POLICY "Managers remove targets" ON public.crm_targets FOR DELETE TO authenticated USING (public.is_sales_manager(auth.uid()));

CREATE TABLE public.crm_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  name text NOT NULL,
  file_path text NOT NULL UNIQUE,
  size_bytes bigint,
  uploaded_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.crm_documents TO authenticated;
GRANT ALL ON public.crm_documents TO service_role;
ALTER TABLE public.crm_documents ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.can_see_deal(_deal_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (SELECT 1 FROM public.crm_deals d WHERE d.id = _deal_id AND (d.owner_id = auth.uid() OR public.can_view_sales(auth.uid())))
$$;
CREATE OR REPLACE FUNCTION public.can_edit_deal(_deal_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (SELECT 1 FROM public.crm_deals d WHERE d.id = _deal_id AND (d.owner_id = auth.uid() OR public.is_sales_manager(auth.uid())))
$$;
CREATE POLICY "Read docs of visible deals" ON public.crm_documents FOR SELECT TO authenticated USING (public.can_see_deal(deal_id));
CREATE POLICY "Upload docs to editable deals" ON public.crm_documents FOR INSERT TO authenticated WITH CHECK (uploaded_by = auth.uid() AND public.can_edit_deal(deal_id));
CREATE POLICY "Remove docs" ON public.crm_documents FOR DELETE TO authenticated USING (uploaded_by = auth.uid() OR public.is_sales_manager(auth.uid()));

CREATE POLICY "crm docs read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'crm-documents' AND public.can_see_deal(((storage.foldername(name))[1])::uuid));
CREATE POLICY "crm docs upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'crm-documents' AND public.can_edit_deal(((storage.foldername(name))[1])::uuid));
CREATE POLICY "crm docs delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'crm-documents' AND (owner = auth.uid() OR public.is_sales_manager(auth.uid())));