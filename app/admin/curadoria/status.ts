// Status nos quais uma submissão pode ser excluída pelo curador.
// Em arquivo separado porque actions.ts é 'use server' (só permite
// exports de funções async).

export const STATUS_EXCLUIVEIS = new Set([
  'pendente',
  'em_revisao',
  'rejeitado',
])
