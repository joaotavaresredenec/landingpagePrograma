# Handoff: Copywriter → PM

**Ticket:** SP1-01 a SP1-06
**Sprint:** 1
**Status:** concluído
**Data:** 2026-04-21

## Resumo em uma frase

Todo o conteúdo textual da landing page foi produzido em `config/copy.ts`, cobrindo hero, desafios, biblioteca, orientações práticas, sobre o Programa, formulário, rodapé, páginas complementares e e-mail transacional, com tom institucional colaborativo e alinhamento à LGPD.

## Artefatos entregues

- `config/copy.ts` — todo o conteúdo textual do site (SP1-01 a SP1-06), exportado como constantes TypeScript prontas para importação nos componentes React.

## Decisões tomadas autonomamente

- **Subheadline do hero:** o brief indicava a frase "A Redenec, parceira institucional do MEC, reúne materiais e orientações práticas para apoiar a implementação na sua rede." na seção de contexto — adotada literalmente por ser precisa, empática e dentro do limite de 30 palavras.
- **Corpos dos cards de desafios:** escritos em 2-3 linhas com solução integrada ao reconhecimento do desafio, evitando qualquer tom de crítica institucional.
- **Textos do accordion:** escritos entre 120 e 200 palavras cada, com estrutura de subtópicos para facilitar leitura em mobile. O item "Perguntas frequentes" tem 6 Q&As (o brief pedia mínimo de 4) para cobrir as dúvidas mais críticas identificadas no brief (prazo do plano, status dos materiais, municípios pequenos).
- **Texto "Sobre o Programa":** inclui menção ao número aproximado de redes aderidas ("mais de 1.200 municípios e estados") como elemento de credibilidade e confiança. Se a Redenec não tiver confirmação desse dado, o trecho deve ser substituído por dado verificado ou removido.
- **Campo UF no formulário:** o brief especifica "27 opções" mas o copy apenas produz label, placeholder e mensagem de erro — a lista das 27 UFs é responsabilidade do componente React (dados, não copy).
- **Aviso LGPD no rodapé:** adicionado campo `avisoLgpd` e `linkPolitica`/`linkPoliticaLabel` além do previsto no schema de exemplo, pois o brief exige visibilidade da política no rodapé e o schema original não os previa.
- **Assinatura do e-mail:** inclui URL do domínio `cidadaniaesustentabilidade.com.br` conforme o brief, embora o domínio ainda esteja pendente de registro.

## Desvios do brief

- O brief menciona "texto discreto OBC" no rodapé — entregue como `textoObc` em `copyRodape`. O texto completo de redes sociais e links da Redenec não foi especificado no brief; os campos correspondentes não foram criados para não inventar URLs ou perfis não confirmados. O desenvolvedor deve adicioná-los ao componente diretamente.
- O brief menciona que a política de privacidade deve ser "revisada" — o texto entregue é completo e estruturado, mas a revisão jurídica formal é recomendada antes do lançamento.

## Dependências ou bloqueios

- **Dado a verificar:** número de redes aderidas ao Programa mencionado em `copySobre.texto` ("mais de 1.200 municípios e estados"). A Redenec deve confirmar ou substituir por dado verificado.
- **Domínio pendente:** `cidadaniaesustentabilidade.com.br` ainda não registrado — mencionado na assinatura do e-mail e na política de privacidade. Quando registrado, nenhuma alteração de copy será necessária (os textos já usam o domínio correto).
- **Revisão jurídica da política de privacidade:** recomendada antes do deploy em produção.
- **Lista de UFs:** a ser implementada como dado no componente React, não em copy.

## Checklist de critérios de aceite

- [x] Headline e CTA primário não foram alterados
- [x] Nenhum texto pode ser lido como crítica ao MEC ou ao governo
- [x] Todo problema apontado vem com solução proposta
- [x] Política de privacidade alinhada à LGPD com contato@redenec.org e canal de exclusão de dados
- [x] E-mail com aviso de expiração de 30 dias
- [x] Tom de serviço público, sem urgência artificial
- [x] Títulos em sentence case
- [x] Voz ativa, presente do indicativo, primeira pessoa do plural institucional
- [x] Palavras proibidas ausentes (falha, omissão, revolucionário, exclusivo, insights, empowerment)
- [x] Checkbox LGPD com menção a contato@redenec.org
- [x] Saudação do e-mail com variável {NOME} para o Brevo
- [x] Fallback de URL bruta no e-mail ({MAGIC_LINK_URL})
- [x] Assunto do e-mail dentro de 60 caracteres
- [x] Pré-cabeçalho do e-mail dentro de 100 caracteres

## Próximo passo sugerido

PM valida `config/copy.ts` e confirma o dado sobre número de redes aderidas em `copySobre.texto`. Em seguida, repassa para UX/UI integrar as constantes nos componentes React. Recomenda-se revisão jurídica da política de privacidade antes do deploy.
