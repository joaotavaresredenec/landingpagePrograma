---
name: processamento-material-bruto
description: Transforma materiais brutos da Redenec (PDFs extensos, livros, apostilas, planilhas) em entradas curadas para a biblioteca do site, com título editorial, resumo de 150 palavras, pontos-chave, sugestão de thumbnail e link de download. Usar sempre que houver um material em /brief/materiais-redenec/ que precise virar um card de vitrine ou entrada da biblioteca completa.
---

# Skill: Processamento de material bruto

Transforma materiais pesados em entradas leves e atrativas.

## Por que esta skill existe

O acervo da Redenec contém materiais valiosos mas densos: livros de 200 páginas, apostilas de formação, planilhas de indicadores. Gestores não vão ler o material todo antes de decidir se é útil. O papel desta skill é curar cada material em 3 camadas:

1. **Camada de vitrine** (card na seção 3 da landing) — título + 2 linhas
2. **Camada de biblioteca** (card completo em `/materiais`) — título + resumo + 3-5 pontos-chave + thumbnail
3. **Camada de aprofundamento** — link de download do PDF completo no Google Drive

## Processo

Para cada material em `/brief/materiais-redenec/`:

### Passo 1 — Leitura e inventário

- Ler título original, índice/sumário e introdução/prefácio
- Identificar o público primário (técnico? gestor? professor? estudante?)
- Identificar 3-5 pontos-chave que um gestor precisa saber
- Identificar se o material tem aplicação direta ou é referencial

### Passo 2 — Título editorial

O título original pode ser longo, acadêmico ou genérico. Produza um título editorial que:
- Tenha no máximo 5 palavras
- Comunique o benefício imediato ("Guia do ponto focal" em vez de "Orientações metodológicas para pontos focais em programas de educação cidadã")
- Seja consistente com os demais títulos da biblioteca

### Passo 3 — Resumo de 150 palavras

Estrutura do resumo:
- **Frase 1-2:** o que é o material
- **Frase 3-4:** para quem é (perfil do leitor)
- **Frase 5-6:** o que o leitor vai conseguir fazer depois de ler
- **Frase 7-8:** sugestão de uso (leitura individual, para equipe, em formação)

Exemplo:

> O Guia do Ponto Focal reúne atribuições, critérios de escolha e roteiros de atuação para o profissional designado como responsável pelo Programa na rede. Foi produzido a partir de experiências de secretarias que já implementaram programas similares e revisado por especialistas do ecossistema de educação cidadã. É destinado a técnicos de secretarias e gestores escolares que precisam articular equipes e planos de ação. Após a leitura, o responsável tem clareza sobre suas responsabilidades, um passo a passo para os primeiros 30 dias e modelos de comunicação com escolas. Indicamos a leitura individual como base e uma discussão em equipe antes da definição formal do ponto focal.

### Passo 4 — Pontos-chave

Lista de 3-5 bullets, cada um com:
- Um verbo no infinitivo iniciando
- Ação concreta, não abstrata

Exemplo:
- Entender o papel do ponto focal em 4 dimensões (articulação, formação, monitoramento, comunicação)
- Aplicar um checklist para escolha do profissional certo
- Organizar os primeiros 30 dias com roteiro dia-a-dia
- Adaptar modelos de comunicação para escolas da rede

### Passo 5 — Sugestão de thumbnail

Descrever em uma frase o que deve aparecer no thumbnail. O UX/UI agent vai gerar ou selecionar.

Padrão sugerido para consistência:
- Fundo: cor da paleta Redenec (verde `#1cff9e`, azul `#0086ff`, coral `#ff8b80`, azul-petróleo `#1b415e`)
- Elemento central: símbolo gráfico simples (círculo do logo Redenec, ícone Lucide, ou ilustração mínima)
- Sem imagens de stock de gente olhando para a câmera
- Sem texto no thumbnail (o título fica fora)

Exemplo: "Thumbnail com fundo verde `#1cff9e` e um círculo grande central em azul-petróleo `#243837` remetendo ao símbolo do logo."

### Passo 6 — Link para Google Drive

Cada material precisa de um link de download. Como a pasta no Drive ainda não existe no momento do processamento:

1. Deixar placeholder no código: `driveUrl: 'DRIVE_URL_A_DEFINIR_[slug]'`
2. Registrar em `config/materials.ts` o array de materiais com todos os campos, incluindo o placeholder
3. Gerar um arquivo `TODO-DRIVE.md` na raiz listando cada slug e pedindo que o usuário humano preencha com a URL real após subir os arquivos

## Formato de saída para cada material

Salvar em `content/materials/[slug].md` com frontmatter estruturado:

```markdown
---
id: guia-ponto-focal
titulo: Guia do Ponto Focal
tituloOriginal: Orientações metodológicas para pontos focais
slug: guia-ponto-focal
publicoAlvo: [tecnico, gestor]
cardVitrine: "Roteiro prático com atribuições, perfil ideal e primeiros passos do responsável pelo Programa na rede."
thumbnailDescricao: "Fundo verde #1cff9e com círculo central em azul-petróleo #243837"
driveUrl: DRIVE_URL_A_DEFINIR_guia-ponto-focal
---

## Resumo
[150 palavras conforme estrutura da skill]

## Pontos-chave
- [bullet 1]
- [bullet 2]
- [bullet 3]
- [bullet 4]

## Observações para o UX/UI
[Qualquer nota sobre apresentação visual específica deste material]
```

Depois, o UX/UI agent lê esses arquivos e gera os componentes visuais. O Integrations agent lê estes arquivos para preencher `config/materials.ts`.
