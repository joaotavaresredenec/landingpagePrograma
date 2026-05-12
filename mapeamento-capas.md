# Mapeamento de capas — public/logos/capas/

## Contexto

Hoje, as capas dos materiais **não são arquivos locais**. O sistema usa fotos do
Unsplash carregadas via ID em `config/thumbnails.ts:4` (`THUMBNAIL_PHOTOS`), e a
URL é montada em `components/ui/MaterialThumbnail.tsx:82` no formato
`https://images.unsplash.com/photo-{ID}?w=600&q=70&auto=format&fit=crop`.
Sobre essa foto vem um overlay sólido da cor da organização (`opacity: 0.72`).

Os 32 PNGs em `public/logos/capas/` são novos e **não têm referência em
nenhum arquivo do projeto** (`grep -r "logos/capas" → 0 matches`).

**Substituição pretendida**: trocar `THUMBNAIL_PHOTOS` (Unsplash) por um novo
mapa `THUMBNAIL_CAPAS` (arquivos locais), e ajustar `MaterialThumbnail.tsx`
para usar o arquivo local quando existir, mantendo Unsplash como fallback.

**Importante**: o `materials.json` tem **36 materiais** e você forneceu
**32 PNGs**. Quatro materiais ficam sem capa nova (listados ao fim).

## Tabela: PNG → material → referência atual

> "Referência atual" é o ID Unsplash em `config/thumbnails.ts` que será
> trocado pelo arquivo PNG local.

| PNG fornecido | ID do material | Título editorial | Referência Unsplash atual (linha em `config/thumbnails.ts`) |
|---|---|---|---|
| `amarelinhaeemmiudos.png` | `amarelinha-em-miudos` | Amarelinha em Miúdos: Constituição e cidadania de forma lúdica | `1503454537195-1dcabb73ffb9` (L147) |
| `Auschwitzescolalugardepertencer.png` | `kit-de-atividades-escola-e-lugar-de-pertencer` | Kit de Atividades: Escola é lugar de pertencer | `1503454537195-1dcabb73ffb9` (L123) |
| `cidadaniaedemocraciadesdeaescolacadernometodologico.png` | `caderno-metodologico-cidadania-e-democracia-desde-a-escola` | Cidadania e Democracia desde a Escola: caderno metodológico | `1580582932707-520aed937b7b` (L111) |
| `cursoeadcidadaniaepoliticaspublicas.png` | `curso-ead-cidadania-e-politicas-publicas` | Curso EaD: Cidadania e Políticas Públicas | `1501504905252-473c47e087f8` (L139) |
| `direitosecidadaniacadernosprofessoreletivaauschwitz.png` | `direitos-e-cidadania-cadernos-do-professor` | Direitos e Cidadania: cadernos do professor para eletiva | `1524178232363-1fb2b075b655` (L115) |
| `FundacaoFHC_caminhosustentaveis.png` | `roteiros-pedagogicos---caminhos-sustentaveis-acoes-locais-im` | Caminhos Sustentáveis: ações locais, impactos globais | `1504711434969-e33886168f5c` (L47) |
| `FundacaoFHC_direitoàeducacao.png` | `roteiros-pedagogicos---direito-a-educacao` | Roteiro Pedagógico: Direito à Educação | `1503676260728-1c00da094a0b` (L23) |
| `FundacaoFHC_direitosindigenas.png` | `roteiros-pedagogicos---direitos-indigenas-em-foco` | Roteiro Pedagógico: Direitos Indígenas em Foco | `1441974231531-c6227db76b6e` (L27) |
| `FundacaoFHC_direitoslgbtqpn+.png` | `roteiros-pedagogicos---direitos-lgbtqiapn` | Roteiro Pedagógico: Direitos LGBTQIAPN+ | `1529156069898-49953e39b3ac` (L31) |
| `FundacaoFHC_educaremtemposdeIA.png` | `colecao-coracoes-e-mentes---vol-4-educar-em-tempos-de-inteli` | Educar em Tempos de Inteligência Artificial (Vol. 4) | `1518770660439-4636190af475` (L19) |
| `FundacaoFHC_ensinoreligoso.png` | `colecao-coracoes-e-mentes---vol-2-ensino-religioso-e-valores` | Ensino Religioso e Valores Democráticos (Vol. 2) | `1445112098836-5640e2c61ea7` (L11) |
| `FundacaoFHC_internetedemocracia.png` | `colecao-coracoes-e-mentes---vol-1-pensando-de-forma-autonoma` | Pensando de forma autônoma: internet e democracia (Vol. 1) | `1460925895917-afdab827c52f` (L7) |
| `FundacaoFHC_Linhas do tempo.png` | `linhas-do-tempo` | Linhas do Tempo: construção de direitos no Brasil (1985–2018) | `1513475382585-d06e58bcb0e0` (L63) |
| `FundacaoFHC_minidocumentarios.png` | `vale-a-pena-perguntar` | Vale a Pena Perguntar: mini-documentários sobre democracia | `1485846234645-a62644f84728` (L59) |
| `FundacaoFHC_mulheresemfoco.png` | `roteiros-pedagogicos---mulheres-em-foco-caminhos-para-a-equi` | Mulheres em Foco: caminhos para a equidade | `1573497019940-1c28c88b4f3e` (L51) |
| `FundacaoFHC_nacionalismo.png` | `colecao-coracoes-e-mentes---vol-3-nacionalismo-e-democracia` | Nacionalismo e Democracia: formação cidadã crítica (Vol. 3) | `1540910419892-4a36d2c3266c` (L15) |
| `FundacaoFHC_pessoascomdeficiencia.png` | `roteiros-pedagogicos---pessoas-com-deficiencia-em-foco` | Roteiro Pedagógico: Pessoas com Deficiência em Foco | `1573496359142-b8d87734a5a2` (L35) |
| `FundacaoFHC_questoesraciaisemfoco.png` | `roteiros-pedagogicos---questoes-raciais-em-foco` | Roteiro Pedagógico: Questões Raciais em Foco | `1541339907198-e08756dedf3f` (L39) |
| `FundacaoFHC_susnaescola.png` | `roteiros-pedagogicos---saude-para-todos-enfrentando-desafios` | Saúde para Todos: entendendo o SUS na escola | `1576091160550-2173dba999ef` (L55) |
| `FundacaoFHC_transparenciaecontrole.png` | `roteiros-pedagogicos---transparencia-e-controle-social` | Roteiro Pedagógico: Transparência e Controle Social | `1589994965851-a8f479c573a9` (L43) |
| `kitdeatividadesdemocraciaebemdetodosnos.png` | `kit-de-atividades-democracia-e-bem-de-todos-nos` | Kit de Atividades: Democracia é bem de todos nós | `1529156069898-49953e39b3ac` (L119) |
| `Mobis_Cidadaniademocraciaparticipacao.png` | `cidadania-democracia-e-participacao-praticas-pedagogicas-par` | Cidadania, Democracia e Participação: 11 práticas para EF II e EM | `1431540015161-0bf868a2d407` (L71) |
| `palavraabertaebiblitecaeducamidia.png` | `biblioteca-educamidia-educacao-midiatica-e-temas-transversai` | Biblioteca EducaMídia: educação midiática e temas transversais | `1495020689067-958852a7765e` (L103) |
| `palavraabertakitdecartassociedade2.0.png` | `kit-de-cartas-sociedade-conectada` | Kit de Cartas Sociedade Conectada 2.0 | `1611162617474-5b21e879e113` (L99) |
| `palavraabertaminhavoznasredes.png` | `planos-de-aula-minha-voz-nas-redes-a-forca-das-hashtags-e-au` | Minha Voz nas Redes, Hashtags e Autoexpressão com Responsabilidade | `1611605698335-8b1569810432` (L107) |
| `porvirfuturoancestralnaescola.png` | `futuro-ancestral-na-escola` | Futuro Ancestral na Escola: justiça climática e equidade racial | `1469571486292-0ba58a3f068b` (L143) |
| `serenascartilhaparaprofissionais.png` | `cartilha-violencia-contra-mulher-nao-e-normal` | Violência Contra Mulher Não é Normal: cartilha para profissionais | `1573497019940-1c28c88b4f3e` (L131) |
| `serenastrilhasformativas.png` | `trilhas-formativas-online-sobre-prevencao-e-enfrentamento-de` | Trilhas Formativas: enfrentamento de violências contra meninas e mulheres | `1543269664-56d93e3e3d9b` (L135) |
| `serenasviolenciaalagoas.png` | `guia-para-prevencao-as-violencias-contra-meninas-na-educacao` | Guia de Prevenção às Violências contra Meninas: Alagoas | `1607990281513-2c110a25bd8c` (L127) |
| `vivenbaralhoeoutrashistorias.png` | `baralho-outras-historias-novas-identidades` | Baralho Outras Histórias, Novas Identidades | `1522071820081-009f0129c71c` (L95) |
| `vivencidademejogo.png` | `cidade-em-jogo` | Cidade em Jogo: gestão pública como experiência pedagógica | `1477959858617-67f85cf4f1df` (L87) |
| `vivensankofaananse.png` | `sankofa-ananse-guia-de-letramento-racial-para-educadores` | Sankofa Ananse: guia de letramento racial para educadores | `1554861846-a2d5bc17f3b8` (L91) |

## Materiais SEM PNG fornecido (4)

Estes continuarão usando a foto do Unsplash atual:

| ID | Título | Foto Unsplash atual |
|---|---|---|
| `infograficos` | Infográficos Histórias de Democracia | `1551288049-bebda4e38f71` (L67) |
| `chega-junto-juventudes` | Chega Junto Juventudes: podcast de jovens sobre cidadania | `1478737270239-2f02b77fc618` (L75) |
| `sequencia-de-planos-de-aula` | Três Planos de Aula: corrupção, desigualdade e convivência | `1509062522246-3755977927d7` (L79) |
| `metodologia-7pegg` | Metodologia 7PEGG: gentileza, generosidade e cidadania | `1559027615-cd4628902d4a` (L83) |

## Não identificados

Nenhum PNG ficou sem match. Todos os 32 PNGs foram associados a um material
com confiança alta com base no nome do arquivo + organização + título.

## Observações sobre nomes de arquivo

Dois nomes têm caracteres especiais que podem dar problema em URL/build:

- `FundacaoFHC_direitoàeducacao.png` — contém `à` (acento agudo)
- `FundacaoFHC_direitoslgbtqpn+.png` — contém `+`
- `FundacaoFHC_Linhas do tempo.png` — contém espaço

**Sugestão**: durante a etapa de otimização, renomear para
versões ASCII-safe (`-`/`_`, sem espaços/acentos/símbolos) antes de gerar
WebP/JPG. Aguardo confirmação se posso renomear ou se você prefere manter os
nomes originais e lidar com encoding nas URLs.

## Decisões de implementação que precisam de confirmação

1. **Renomear arquivos com caracteres problemáticos?** Recomendo sim.
2. **Manter Unsplash como fallback** para os 4 materiais sem PNG novo, ou
   gerar capa-placeholder? Recomendo manter Unsplash.
3. **Estrutura de pastas de saída** conforme solicitado:
   `public/logos/capas/optimized/{thumb,full,jpg}/<nome>.{webp,jpg}`
4. **Backup**: mover PNGs originais para `public/logos/capas/_originais/`
   antes da otimização (não deletar).
5. **`<picture>` com srcset**: o site atual usa `next/image`, que **não
   aceita `<picture>`** — `next/image` faz negociação de formato e tamanhos
   automaticamente quando configurado. Se quiser `<picture>` explícito,
   precisamos trocar `next/image` por `<img>` puro nesta área (perde
   otimização automática mas ganha controle). Recomendo manter `next/image`
   apontando para o WebP e configurar `next.config.mjs` para servir AVIF/WebP
   nativamente.
6. **Deploy via `vercel --prod`**: Vercel CLI não está instalada localmente.
   Alternativas: (a) você instala `npm i -g vercel` antes de chegarmos no
   deploy; (b) usar `git push origin main` (auto-deploy Vercel, como nos
   commits anteriores).

---

**Próximo passo**: aguardo confirmação para prosseguir com a otimização.
