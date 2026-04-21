# BRIEF — Landing page do Programa Educação para a Cidadania e Sustentabilidade

## Contexto

A Rede Nacional de Educação Cidadã (Redenec) é parceira institucional do Ministério da Educação (MEC) no **Programa Educação para a Cidadania e Sustentabilidade**. O Programa é oficial, voluntário, e redes (estados, DF e municípios) aderem via termo assinado pelo secretário de educação.

Após a adesão, cada rede precisa:
1. Indicar um ponto focal para o Programa
2. Elaborar um plano de ação e entregá-lo ao MEC
3. Executar o plano em suas escolas

**Lacuna identificada:** o MEC não fornece ferramental prático para execução. A Redenec coletou materiais do ecossistema de educação cidadã (recursos didáticos, trilhas pedagógicas, jogos, guias) e os entregou ao MEC via Acordo de Cooperação, mas esses materiais ainda não foram disponibilizados pelo Ministério. A Redenec pode disponibilizá-los diretamente via esta landing page.

## Objetivo de negócio

Captar leads qualificados (técnicos de secretarias, gestores escolares, professores) que poderão ser acionados posteriormente para divulgação da **Olimpíada Brasileira de Cidadania (OBC)** e de outras iniciativas da Redenec.

Todo lead captado deve:
- Receber imediatamente acesso aos materiais via magic link por e-mail
- Ser segmentado por perfil, localização e etapa de ensino no Brevo
- Ter consentimento LGPD registrado e auditável

## Público-alvo (em ordem de prioridade)

1. **Técnicos de Secretarias de Educação** — são quem tem o plano de ação na mão e não sabe por onde começar. Foco principal.
2. **Gestores escolares** — diretores e coordenadores que vão operacionalizar o Programa nas escolas.
3. **Professores** — executam em sala de aula.
4. **Estudantes** — captação leve, pensando na OBC.

## Estrutura da landing page (7 seções, nesta ordem)

### 1. Hero
- Headline: "Sua rede aderiu ao Programa. E agora?"
- Subheadline: "A Redenec, parceira institucional do MEC, reúne materiais e orientações práticas para apoiar a implementação na sua rede."
- CTA primário: "Quero acesso aos materiais" (ancora no formulário)
- Faixa com logos dos parceiros institucionais: MEC, Redenec, CNJ, CNMP, CGU, UNESCO, Undime, Consed
- Elemento visual: grafismos modulares da Redenec (círculos + linhas) sobre imagem ou fundo com cor da marca

### 2. Desafios de implementação
- Título: "Implementar um programa nacional é complexo. Você não precisa fazer isso sozinho."
- 4 cards empáticos, sem crítica institucional:
  - Indicar e orientar o ponto focal
  - Elaborar um plano de ação eficaz
  - Encontrar materiais prontos para sala de aula
  - Monitorar a execução na rede

### 3. Biblioteca de materiais (prévia)
- Título: "O que você encontra aqui"
- Grid de 6 cards, cada um com ícone, título, descrição (2 linhas) e botão "Acessar" que ancora no formulário:
  - Guia do Ponto Focal
  - Modelo de Plano de Ação
  - Trilhas Pedagógicas
  - Recursos Didáticos
  - Jogos e Dinâmicas
  - Banco de Boas Práticas

### 4. Orientações práticas
- Título: "O que fazer depois da adesão"
- Accordion com 6 itens:
  - Passo a passo pós-adesão
  - Como elaborar o plano de ação
  - Como escolher o ponto focal
  - Como monitorar a execução
  - Integração com a BNCC
  - Perguntas frequentes

### 5. Sobre o Programa
- Síntese institucional em 3-4 linhas
- Quem pode aderir: estados, DF e municípios (voluntário, via secretário)
- Parceiros institucionais
- Link externo: https://www.gov.br/mec/pt-br/programa-educacao-cidadania-sustentabilidade

### 6. Formulário de captação
- `id="formulario"` (âncora dos CTAs)
- Campos:
  - Nome completo (obrigatório)
  - E-mail institucional (obrigatório)
  - Perfil (select: Técnico de secretaria / Gestor escolar / Professor / Estudante)
  - Estado — UF (select com 27 opções)
  - Município (texto)
  - Etapa de ensino (select: EF anos iniciais / EF anos finais / Ensino Médio / EJA / Todas)
- Checkbox LGPD obrigatório com texto: "Concordo com a política de privacidade e autorizo o uso dos meus dados para recebimento de informações sobre o Programa e iniciativas relacionadas."
- Botão: "Quero acesso aos materiais e orientações"
- Ao submeter:
  1. Cria/atualiza contato no Brevo com os atributos
  2. Gera token criptograficamente seguro
  3. Salva token no Vercel KV com TTL de 30 dias
  4. Dispara e-mail transacional via Brevo com magic link para `/materiais?token=TOKEN`
  5. Redireciona usuário para `/obrigado`

### 7. Rodapé
- Contato MEC: cogeb@mec.gov.br / (61) 2022-7940
- Links Redenec e redes sociais
- Política de privacidade
- Texto discreto: "Em breve: Olimpíada Brasileira de Cidadania"

## Páginas complementares

- `/obrigado` — confirmação do envio com instrução para checar e-mail
- `/materiais?token=X` — biblioteca completa protegida por magic link. Valida o token no Vercel KV. Se inválido, redireciona para `/#formulario`. Se válido, exibe grid com thumbnails, resumos e botões de download (links para Google Drive).
- `/politica-de-privacidade` — texto LGPD adaptado para site de coleta de dados educacionais

## Stack técnica obrigatória

- **Framework:** Next.js 14+ com App Router e TypeScript
- **Estilo:** Tailwind CSS
- **Deploy:** Vercel (plano gratuito)
- **Formulário:** integração direta com Brevo API v3
- **Storage de tokens:** Vercel KV (Redis)
- **Ícones:** Lucide React
- **Fonte:** Figtree via `next/font/google`
- **Domínio:** `programacidadaniaesustentabilidade.com.br` (a ser registrado no Registro.br)
- **Versionamento:** Git + repositório privado no GitHub desde o primeiro commit

## Restrições

1. **Tom institucional colaborativo.** A Redenec é parceira oficial do MEC. Nenhum texto, em nenhum lugar do site ou dos artefatos internos, pode ser interpretado como crítica ao Ministério, ao governo ou à gestão atual. Dificuldades de execução são tratadas como "desafios naturais de qualquer programa de escala nacional".
2. **LGPD é inegociável.** Checkbox de consentimento obrigatório, política de privacidade acessível, dados coletados estritamente para a finalidade declarada.
3. **Acessibilidade WCAG AA.** Contraste mínimo 4.5:1, navegação por teclado, ARIA labels em elementos interativos.
4. **Mobile-first.** Mais de 60% dos gestores acessam conteúdo via celular.
5. **Sem conteúdo gerado por IA visivelmente "automático".** Copy precisa soar humano e institucional.

## Materiais brutos disponíveis (em /brief/materiais-redenec/)

PDFs e arquivos do acervo da Redenec. Alguns são extensos (livros de 200+ páginas). O Copywriter deve aplicar a skill `processamento-material-bruto` para transformar cada item em:
- Título editorial (se diferente do original)
- Resumo de 150 palavras
- 3-5 pontos-chave
- Sugestão de thumbnail (para o UX/UI gerar ou selecionar)
- Link de download do PDF original no Google Drive

## Critérios de sucesso

- Site deployado em domínio próprio com HTTPS
- Formulário envia lead para Brevo e dispara magic link em menos de 5 segundos
- Lighthouse scores: Performance 90+, Accessibility 95+, SEO 95+
- Responsivo em 320px, 768px, 1024px e 1440px
- Zero erros de console em produção
- Política de privacidade revisada e alinhada à LGPD
- Repositório GitHub privado com README explicando manutenção
