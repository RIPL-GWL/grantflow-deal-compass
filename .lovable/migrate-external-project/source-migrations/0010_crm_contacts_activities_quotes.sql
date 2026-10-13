CREATE TABLE public.crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  company text,
  designation text,
  phone text,
  email text,
  city text,
  gstin text,
  address text,
  notes text,
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_contacts TO authenticated;
GRANT ALL ON public.crm_contacts TO service_role;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sales team reads contacts" ON public.crm_contacts FOR SELECT TO authenticated USING (public.is_sales_staff(auth.uid()) OR public.can_view_sales(auth.uid()));
CREATE POLICY "Sales team adds contacts" ON public.crm_contacts FOR INSERT TO authenticated WITH CHECK (public.is_sales_staff(auth.uid()) AND (owner_id = auth.uid() OR public.is_sales_manager(auth.uid())));
CREATE POLICY "Owner or manager edits contacts" ON public.crm_contacts FOR UPDATE TO authenticated USING (owner_id = auth.uid() OR public.is_sales_manager(auth.uid())) WITH CHECK (owner_id = auth.uid() OR public.is_sales_manager(auth.uid()));
CREATE POLICY "Managers delete contacts" ON public.crm_contacts FOR DELETE TO authenticated USING (public.is_sales_manager(auth.uid()));

ALTER TABLE public.crm_deals ADD COLUMN contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE SET NULL;
ALTER TABLE public.crm_deals ADD COLUMN next_followup_at timestamptz;
ALTER TABLE public.crm_deals ADD COLUMN followup_note text;
CREATE INDEX crm_deals_followup_idx ON public.crm_deals (next_followup_at) WHERE next_followup_at IS NOT NULL;

CREATE TABLE public.crm_deal_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  kind text NOT NULL DEFAULT 'note' CHECK (kind IN ('call','meeting','whatsapp','email','note','stage','quote')),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.crm_deal_activities TO authenticated;
GRANT ALL ON public.crm_deal_activities TO service_role;
ALTER TABLE public.crm_deal_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read activities of visible deals" ON public.crm_deal_activities FOR SELECT TO authenticated USING (public.can_see_deal(deal_id));
CREATE POLICY "Log activities on editable deals" ON public.crm_deal_activities FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.can_edit_deal(deal_id));
CREATE POLICY "Author or manager removes activity" ON public.crm_deal_activities FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.is_sales_manager(auth.uid()));

CREATE SEQUENCE public.crm_quote_seq START 1001;
GRANT USAGE ON SEQUENCE public.crm_quote_seq TO authenticated, service_role;
CREATE TABLE public.crm_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  number text NOT NULL DEFAULT ('RIPL-Q-' || nextval('public.crm_quote_seq')),
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  gst_percent numeric NOT NULL DEFAULT 18 CHECK (gst_percent >= 0 AND gst_percent <= 28),
  discount numeric NOT NULL DEFAULT 0 CHECK (discount >= 0),
  valid_until date,
  terms text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','accepted','rejected')),
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_quotes TO authenticated;
GRANT ALL ON public.crm_quotes TO service_role;
ALTER TABLE public.crm_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read quotes of visible deals" ON public.crm_quotes FOR SELECT TO authenticated USING (public.can_see_deal(deal_id));
CREATE POLICY "Create quotes on editable deals" ON public.crm_quotes FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid() AND public.can_edit_deal(deal_id));
CREATE POLICY "Edit quotes on editable deals" ON public.crm_quotes FOR UPDATE TO authenticated USING (public.can_edit_deal(deal_id)) WITH CHECK (public.can_edit_deal(deal_id));
CREATE POLICY "Creator or manager deletes quotes" ON public.crm_quotes FOR DELETE TO authenticated USING (created_by = auth.uid() OR public.is_sales_manager(auth.uid()));