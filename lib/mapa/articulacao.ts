// Gera links de busca Google pré-formatados para facilitar articulação
// com gestores locais. Reutilizados pelo DrawerDetalhes.

const UF_NOMES: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas',
  BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal',
  ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão',
  MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais',
  PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco',
  PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima',
  SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe',
  TO: 'Tocantins',
}

export type LinkArticulacao = {
  label: string
  url: string
  descricao: string
}

const buscarGoogle = (q: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(q)}`

export function gerarLinksMunicipio(nomeMunicipio: string, uf: string): LinkArticulacao[] {
  const nomeUf = UF_NOMES[uf] ?? uf
  return [
    {
      label: 'Secretaria de Educação',
      url: buscarGoogle(`secretaria municipal de educação ${nomeMunicipio} ${nomeUf}`),
      descricao: 'Buscar contato da Secretaria Municipal de Educação',
    },
    {
      label: 'Prefeitura',
      url: buscarGoogle(`prefeitura ${nomeMunicipio} ${nomeUf} site oficial`),
      descricao: 'Buscar site oficial da Prefeitura',
    },
    {
      label: 'Portal da transparência',
      url: buscarGoogle(`portal transparência ${nomeMunicipio} ${nomeUf}`),
      descricao: 'Buscar portal de transparência do município',
    },
  ]
}

export function gerarLinksEstado(uf: string): LinkArticulacao[] {
  const nomeUf = UF_NOMES[uf] ?? uf
  return [
    {
      label: 'Secretaria Estadual de Educação',
      url: buscarGoogle(`secretaria estadual de educação ${nomeUf}`),
      descricao: 'Buscar contato da Secretaria Estadual de Educação',
    },
    {
      label: 'Governo estadual',
      url: buscarGoogle(`governo ${nomeUf} site oficial`),
      descricao: 'Buscar site oficial do Governo do Estado',
    },
    {
      label: 'Consed',
      url: buscarGoogle(`Consed secretário educação ${nomeUf}`),
      descricao: 'Buscar informações no Consed (Conselho de Secretários)',
    },
  ]
}

/**
 * Estimativa aproximada de alunos da rede municipal:
 * - ~18% da população em idade escolar (4-17 anos)
 * - ~35% deste grupo na rede pública municipal (média conservadora nacional)
 * Para dados oficiais, consultar Censo Escolar/INEP.
 */
export function estimarAlunosRedeMunicipal(populacao: number | undefined): number | null {
  if (!populacao || populacao <= 0) return null
  const idadeEscolar = populacao * 0.18
  const redeMunicipal = idadeEscolar * 0.35
  return Math.round(redeMunicipal)
}

export function formatarAlunos(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace('.0', '').replace('.', ',')} milhões`
  if (num >= 1_000) return `${Math.round(num / 1_000)} mil`
  return String(num)
}

export function formatarPopulacao(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2).replace('.00', '').replace('.', ',')} milhões`
  if (num >= 1_000) return `${Math.round(num / 1_000)} mil`
  return String(num)
}
