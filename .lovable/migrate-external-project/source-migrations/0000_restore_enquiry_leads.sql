CREATE TABLE public.leads (
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
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT TO anon, authenticated
WITH CHECK (
  lead_type IN ('manufacturer','retailer','distributor','funding','global','general','contact')
  AND char_length(name) BETWEEN 2 AND 120
  AND char_length(email) BETWEEN 5 AND 200
  AND char_length(phone) BETWEEN 7 AND 20
  AND coalesce(char_length(message),0) <= 4000
);