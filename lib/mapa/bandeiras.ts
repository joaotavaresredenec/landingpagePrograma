// Mapeamento UF -> arquivo de bandeira em /public/bandeiras/
// Os arquivos foram padronizados como `XX.png` (sigla da UF).

const SIGLAS_VALIDAS = new Set([
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT',
  'PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO',
])

export function getBandeiraUrl(uf: string): string | null {
  const sigla = uf?.toUpperCase()
  if (!sigla || !SIGLAS_VALIDAS.has(sigla)) return null
  return `/bandeiras/${sigla}.png`
}
