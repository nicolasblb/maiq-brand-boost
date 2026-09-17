import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const leadInputSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.').max(120, 'Nome muito longo.'),
  email: z.string().trim().toLowerCase().email('Informe um email válido.').max(255, 'Email muito longo.'),
  phone: z.string().trim().max(40, 'Telefone muito longo.').optional(),
  company: z.string().trim().min(2, 'Informe sua empresa.').max(160, 'Empresa muito longa.'),
  message: z.string().trim().max(2000, 'Mensagem muito longa.').optional(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export const submitLead = createServerFn({ method: 'POST' })
  .inputValidator((input) => leadInputSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const normalizedEmail = data.email.trim().toLowerCase();
    const phone = data.phone?.trim();
    const message = data.message?.trim();

    const { error } = await supabaseAdmin.from('leads').upsert(
      {
        name: data.name.trim(),
        email: normalizedEmail,
        normalized_email: normalizedEmail,
        phone: phone ? phone : null,
        company: data.company.trim(),
        message: message ? message : null,
        source: 'website',
      },
      { onConflict: 'normalized_email' },
    );

    if (error) {
      throw new Error('Não foi possível registrar seu contato agora.');
    }

    return { ok: true };
  });