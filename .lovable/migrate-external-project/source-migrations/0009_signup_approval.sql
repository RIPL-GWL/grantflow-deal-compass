ALTER TABLE public.profiles ADD COLUMN approval_status text NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending','approved','rejected'));
ALTER TABLE public.profiles ADD COLUMN reviewed_at timestamptz;
UPDATE public.profiles p SET approval_status = 'approved' WHERE EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = p.id);

CREATE OR REPLACE FUNCTION public.protect_approval_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.approval_status IS DISTINCT FROM OLD.approval_status
     AND auth.uid() IS NOT NULL
     AND NOT public.has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Only the Super Admin can change approval status';
  END IF;
  IF NEW.approval_status IS DISTINCT FROM OLD.approval_status THEN NEW.reviewed_at := now(); END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER profiles_protect_approval BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.protect_approval_status();

CREATE POLICY "Super admin updates profiles" ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin')) WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, approval_status)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name',
          CASE WHEN lower(NEW.email) = 'harsh@rishishwarindustry.in' THEN 'approved' ELSE 'pending' END)
  ON CONFLICT (id) DO NOTHING;
  IF lower(NEW.email) = 'harsh@rishishwarindustry.in' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $function$;