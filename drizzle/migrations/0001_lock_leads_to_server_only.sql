REVOKE SELECT, INSERT, UPDATE ON public.leads FROM authenticated;

DROP POLICY IF EXISTS "Authenticated users can add leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can read leads" ON public.leads;

CREATE POLICY "No direct client access to leads"
ON public.leads
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);
