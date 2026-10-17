CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, approval_status)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'pending')
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

  IF NEW.email_confirmed_at IS NOT NULL
     AND lower(btrim(NEW.email)) = 'harsh@rishishwarindustry.in' THEN
    UPDATE public.profiles
    SET approval_status = 'approved', reviewed_at = now()
    WHERE id = NEW.id;

    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER grant_super_admin_after_email_verification
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.handle_new_user();