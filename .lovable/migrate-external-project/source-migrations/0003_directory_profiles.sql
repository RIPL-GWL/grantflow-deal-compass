CREATE TABLE public.directory_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('investor','mentor','team')),
  slug text NOT NULL CHECK (slug ~ '^[a-z0-9-]{2,80}$'),
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, slug)
);
GRANT SELECT ON public.directory_profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.directory_profiles TO authenticated;
GRANT ALL ON public.directory_profiles TO service_role;
ALTER TABLE public.directory_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published profiles" ON public.directory_profiles FOR SELECT TO anon, authenticated USING (is_published OR public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'content_editor') OR public.has_role(auth.uid(),'hr_manager'));
CREATE POLICY "Editors insert profiles" ON public.directory_profiles FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'content_editor') OR (kind='team' AND public.has_role(auth.uid(),'hr_manager')));
CREATE POLICY "Editors update profiles" ON public.directory_profiles FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'content_editor') OR (kind='team' AND public.has_role(auth.uid(),'hr_manager'))) WITH CHECK (public.is_admin(auth.uid()) OR public.has_role(auth.uid(),'content_editor') OR (kind='team' AND public.has_role(auth.uid(),'hr_manager')));
CREATE POLICY "Admins delete profiles" ON public.directory_profiles FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));