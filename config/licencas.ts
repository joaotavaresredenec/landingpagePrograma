// Licenças de uso para materiais submetidos à curadoria Redenec.
// Persistidas em public.submissoes.licenca (text).
// Rows anteriores a 2026-05 podem usar slugs legados (cc-by, cc-by-sa, etc.) —
// elas seguem armazenadas como o slug cru e aparecem assim no admin.

export type Licenca =
  | 'aberta-com-adaptacao'
  | 'aberta-sem-alteracoes'
  | 'educacional-nao-comercial'

export const LICENCAS: Record<
  Licenca,
  { label: string; descricao: string; ordem: number }
> = {
  'aberta-com-adaptacao': {
    label: 'Material aberto',
    descricao: 'pode ser usado, adaptado e redistribuído livremente',
    ordem: 1,
  },
  'aberta-sem-alteracoes': {
    label: 'Material aberto',
    descricao: 'pode ser usado e redistribuído sem alterações',
    ordem: 2,
  },
  'educacional-nao-comercial': {
    label: 'Uso restrito',
    descricao: 'apenas para fins educacionais não comerciais',
    ordem: 3,
  },
}
