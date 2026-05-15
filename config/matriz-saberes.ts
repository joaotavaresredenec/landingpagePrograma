// Eixos da Matriz de Saberes do PECS (Portaria MEC 642/2025).
// Persistidos em public.submissoes.temas_bncc como text[].

export type EixoMatriz =
  | 'eixo-i'
  | 'eixo-ii'
  | 'eixo-iii'
  | 'eixo-iv'
  | 'eixo-v'

export const MATRIZ_SABERES: Record<EixoMatriz, { label: string; ordem: number }> = {
  'eixo-i':   { label: 'Eixo I: Percepção de Si e do Outro',  ordem: 1 },
  'eixo-ii':  { label: 'Eixo II: Convivência Democrática',    ordem: 2 },
  'eixo-iii': { label: 'Eixo III: Participação Cívica',       ordem: 3 },
  'eixo-iv':  { label: 'Eixo IV: Direitos e Deveres',         ordem: 4 },
  'eixo-v':   { label: 'Eixo V: Sustentabilidade e Futuro',   ordem: 5 },
}
