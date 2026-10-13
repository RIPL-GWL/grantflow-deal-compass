CREATE FUNCTION public.is_programme_team(_user_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role IN('super_admin','admin','programme_manager')) $$;
CREATE TABLE public.programme_applications(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 founder_name text NOT NULL CHECK(char_length(founder_name) BETWEEN 2 AND 120),
 email text NOT NULL CHECK(char_length(email) BETWEEN 5 AND 200),
 phone text NOT NULL CHECK(char_length(phone) BETWEEN 7 AND 20),
 startup_name text NOT NULL CHECK(char_length(startup_name) BETWEEN 1 AND 160),
 city text,
 idea text NOT NULL CHECK(char_length(idea) BETWEEN 20 AND 3000),
 stage text NOT NULL CHECK(stage IN('idea','prototype','early_revenue','growth')),
 funding_need numeric(14,2) NOT NULL DEFAULT 0 CHECK(funding_need>=0),
 funding_interest text NOT NULL CHECK(funding_interest IN('grant','investor','both')),
 participants int NOT NULL DEFAULT 1 CHECK(participants BETWEEN 1 AND 10),
 ai_recommendation text,
 status text NOT NULL DEFAULT 'new' CHECK(status IN('new','contacted','registered','rejected')),
 payment_status text NOT NULL DEFAULT 'pending' CHECK(payment_status IN('pending','partial','paid','refunded')),
 amount_paid numeric(12,2) NOT NULL DEFAULT 0 CHECK(amount_paid>=0),
 assigned_to uuid,
 notes text,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT,UPDATE,DELETE ON public.programme_applications TO authenticated;
GRANT ALL ON public.programme_applications TO service_role;
ALTER TABLE public.programme_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY prog_read ON public.programme_applications FOR SELECT TO authenticated USING(public.is_programme_team(auth.uid()));
CREATE POLICY prog_edit ON public.programme_applications FOR UPDATE TO authenticated USING(public.is_programme_team(auth.uid())) WITH CHECK(public.is_programme_team(auth.uid()));
CREATE POLICY prog_delete ON public.programme_applications FOR DELETE TO authenticated USING(public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'admin'));
CREATE FUNCTION public.prog_touch() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN NEW.updated_at:=now(); RETURN NEW; END $$;
CREATE TRIGGER prog_touch BEFORE UPDATE ON public.programme_applications FOR EACH ROW EXECUTE FUNCTION public.prog_touch();