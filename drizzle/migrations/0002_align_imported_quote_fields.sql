CREATE SEQUENCE IF NOT EXISTS public.crm_quote_seq;
ALTER TABLE public.crm_quotes ADD COLUMN number text NOT NULL DEFAULT ('RIPL-Q-' || nextval('public.crm_quote_seq'));
ALTER TABLE public.crm_quotes ADD COLUMN discount numeric NOT NULL DEFAULT 0 CHECK (discount >= 0);
ALTER TABLE public.crm_quotes ADD COLUMN terms text;
ALTER TABLE public.crm_quotes ALTER COLUMN quote_number SET DEFAULT ('RIPL-Q-' || nextval('public.crm_quote_seq'));
ALTER TABLE public.crm_quotes ALTER COLUMN created_by SET DEFAULT auth.uid();
GRANT USAGE, SELECT ON SEQUENCE public.crm_quote_seq TO authenticated;
GRANT ALL ON SEQUENCE public.crm_quote_seq TO service_role;
COMMENT ON COLUMN public.crm_quotes.quote_number IS 'DEPRECATED: imported application uses number.';