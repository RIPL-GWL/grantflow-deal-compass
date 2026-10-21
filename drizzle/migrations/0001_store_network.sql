CREATE TABLE public.store_network (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state text NOT NULL,
  area text NOT NULL DEFAULT '',
  district text NOT NULL,
  stores integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (state, district)
);
GRANT SELECT ON public.store_network TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_network TO authenticated;
GRANT ALL ON public.store_network TO service_role;
ALTER TABLE public.store_network ENABLE ROW LEVEL SECURITY;
CREATE POLICY store_network_public_read ON public.store_network FOR SELECT TO anon, authenticated USING (is_visible AND stores > 0);
CREATE POLICY store_network_admin_read ON public.store_network FOR SELECT TO authenticated USING (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'store_manager'));
CREATE POLICY store_network_admin_write ON public.store_network FOR ALL TO authenticated USING (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'store_manager')) WITH CHECK (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'store_manager'));