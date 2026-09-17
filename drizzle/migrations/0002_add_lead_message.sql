ALTER TABLE public.leads
ADD COLUMN message text;

ALTER TABLE public.leads
ADD CONSTRAINT leads_message_length CHECK (message IS NULL OR char_length(message) <= 2000);