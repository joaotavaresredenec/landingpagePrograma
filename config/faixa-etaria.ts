// Faixas etárias para materiais submetidos à curadoria Redenec.
// Persistidas em public.submissoes.faixa_etaria (text — ver migração 002).

export type FaixaEtaria =
  | 'livre'
  | '10-mais'
  | '14-mais'
  | 'apenas-educadores'

export const FAIXAS_ETARIAS: Record<FaixaEtaria, { label: string; ordem: number }> = {
  'livre':             { label: 'Livre para todas as idades',                              ordem: 1 },
  '10-mais':           { label: 'A partir de 10 anos (EF II)',                             ordem: 2 },
  '14-mais':           { label: 'A partir de 14 anos (Ensino Médio)',                      ordem: 3 },
  'apenas-educadores': { label: 'Apenas para educadores (não recomendado para menores)',   ordem: 4 },
}
