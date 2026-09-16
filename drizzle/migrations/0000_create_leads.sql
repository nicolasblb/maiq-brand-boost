CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) <= 255),
  normalized_email text NOT NULL CHECK (normalized_email = lower(trim(normalized_email)) AND char_length(normalized_email) <= 255),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 40),
  company text NOT NULL CHECK (char_length(trim(company)) BETWEEN 2 AND 160),
  source text NOT NULL DEFAULT 'website',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT leads_normalized_email_unique UNIQUE (normalized_email)
);

GRANT SELECT, INSERT, UPDATE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can add leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can read leads"
ON public.leads
FOR SELECT
TO authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.set_leads_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  NEW.normalized_email = lower(trim(NEW.normalized_email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.set_leads_updated_at();

CREATE INDEX leads_normalized_email_idx ON public.leads (normalized_email);
CREATE INDEX leads_created_at_idx ON public.leads (created_at DESC);
