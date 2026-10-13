CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_type text NOT NULL,
  name text NOT NULL,
  company text,
  phone text NOT NULL,
  email text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  message text,
  source_page text
);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS assigned_to uuid;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT TO anon, authenticated
WITH CHECK (
  lead_type IN ('manufacturer','retailer','distributor','funding','global','general','contact')
  AND char_length(name) BETWEEN 2 AND 120
  AND char_length(email) BETWEEN 5 AND 200
  AND char_length(phone) BETWEEN 7 AND 20
  AND coalesce(char_length(message),0) <= 4000
  AND status = 'new' AND assigned_to IS NULL
);

CREATE TABLE IF NOT EXISTS public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id text NOT NULL UNIQUE,
  employee_code text NOT NULL,
  full_name text NOT NULL,
  designation text NOT NULL,
  department text NOT NULL,
  work_location text NOT NULL,
  date_of_joining date,
  official_email text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
INSERT INTO public.employees (employee_id, employee_code, full_name, designation, department, work_location, date_of_joining, official_email) VALUES
('RI-EMP-1024','7F3A9','Rohit Sharma','Business Development Manager','Sales & Marketing','Gwalior, Madhya Pradesh','2024-01-12','rohit.sharma@rishishwarindustry.in'),
('RI-EMP-1025','K8M2Q','Neha Gupta','Marketing Executive','Sales & Marketing','Gwalior, Madhya Pradesh','2024-03-04','neha.gupta@rishishwarindustry.in'),
('RI-EMP-1026','P4X7T','Amit Singh','Operations Executive','Operations','Gwalior, Madhya Pradesh','2024-05-20','amit.singh@rishishwarindustry.in'),
('RI-EMP-1027','H2R9L','Priya Mehta','HR Executive','Human Resources','Gwalior, Madhya Pradesh','2024-07-01','priya.mehta@rishishwarindustry.in'),
('RI-EMP-1028','D6W3N','Karan Verma','Software Developer','Technology','Gwalior, Madhya Pradesh','2024-08-15','karan.verma@rishishwarindustry.in'),
('RI-EMP-1029','B9C5Z','Sneha Jain','Finance Executive','Finance','Gwalior, Madhya Pradesh','2024-10-10','sneha.jain@rishishwarindustry.in')
ON CONFLICT (employee_id) DO NOTHING;

DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('super_admin','admin','lead_manager','sales_executive','store_manager','funding_manager','global_manager','content_editor','hr_manager','viewer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','admin'))
$$;
CREATE OR REPLACE FUNCTION public.can_manage_leads(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','admin','lead_manager','viewer'))
$$;

DROP POLICY IF EXISTS "Users see own roles; admins see all" ON public.user_roles;
CREATE POLICY "Users see own roles; admins see all" ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
DROP POLICY IF EXISTS "Super admin grants roles" ON public.user_roles;
CREATE POLICY "Super admin grants roles" ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(),'super_admin'));
DROP POLICY IF EXISTS "Super admin revokes roles" ON public.user_roles;
CREATE POLICY "Super admin revokes roles" ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(),'super_admin'));

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Own profile or staff reads" ON public.profiles;
CREATE POLICY "Own profile or staff reads" ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid() OR public.is_staff(auth.uid()));
DROP POLICY IF EXISTS "Own profile update" ON public.profiles;
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  IF lower(NEW.email) = 'harsh@rishishwarindustry.in' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP POLICY IF EXISTS "Staff read leads" ON public.leads;
CREATE POLICY "Staff read leads" ON public.leads FOR SELECT TO authenticated
USING (public.can_manage_leads(auth.uid()) OR assigned_to = auth.uid());
DROP POLICY IF EXISTS "Managers or owner update leads" ON public.leads;
CREATE POLICY "Managers or owner update leads" ON public.leads FOR UPDATE TO authenticated
USING ((public.can_manage_leads(auth.uid()) AND NOT public.has_role(auth.uid(),'viewer')) OR assigned_to = auth.uid())
WITH CHECK ((public.can_manage_leads(auth.uid()) AND NOT public.has_role(auth.uid(),'viewer')) OR assigned_to = auth.uid());
DROP POLICY IF EXISTS "Admins delete leads" ON public.leads;
CREATE POLICY "Admins delete leads" ON public.leads FOR DELETE TO authenticated
USING (public.is_admin(auth.uid()));

CREATE TABLE IF NOT EXISTS public.lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  kind text NOT NULL DEFAULT 'note',
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.lead_activities TO authenticated;
GRANT ALL ON public.lead_activities TO service_role;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Read activities of visible leads" ON public.lead_activities;
CREATE POLICY "Read activities of visible leads" ON public.lead_activities FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.leads l WHERE l.id = lead_id AND (public.can_manage_leads(auth.uid()) OR l.assigned_to = auth.uid())));
DROP POLICY IF EXISTS "Add activities to visible leads" ON public.lead_activities;
CREATE POLICY "Add activities to visible leads" ON public.lead_activities FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.leads l WHERE l.id = lead_id AND (public.can_manage_leads(auth.uid()) OR l.assigned_to = auth.uid())));