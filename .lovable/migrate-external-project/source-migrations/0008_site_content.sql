CREATE TABLE public.site_content (
  key text PRIMARY KEY CHECK (key IN ('services','countries','faq','pricing')),
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid DEFAULT auth.uid()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Editors add site content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'content_editor'));
CREATE POLICY "Editors edit site content" ON public.site_content FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'content_editor')) WITH CHECK (public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'content_editor'));
CREATE POLICY "Editors reset site content" ON public.site_content FOR DELETE TO authenticated USING (public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'content_editor'));