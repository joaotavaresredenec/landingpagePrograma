---
name: acessibilidade-wcag-aa
description: Aplica padrões de acessibilidade WCAG AA em componentes e páginas, incluindo contraste de cores, navegação por teclado, ARIA labels, estrutura semântica e comportamento de foco. Usar ao implementar qualquer componente interativo, ao revisar um componente existente para conformidade, ou quando o QA agent apontar questões de acessibilidade.
---

# Skill: Acessibilidade WCAG AA

Garante conformidade com o nível AA do WCAG 2.1 em todos os componentes.

## Princípio

Este é um site de política pública educacional. Acessibilidade não é opcional — é parte do padrão mínimo de qualidade. Meta: Lighthouse Accessibility ≥ 95.

## Contraste de cores

Validar todos os pares texto/fundo contra os mínimos WCAG AA:

| Tamanho do texto | Contraste mínimo |
|---|---|
| Corpo (< 18pt / 24px) | 4.5:1 |
| Títulos grandes (≥ 18pt bold ou 24pt regular) | 3:1 |
| Elementos gráficos e bordas ativas | 3:1 |

### Pares da paleta Redenec — contrastes conhecidos

| Fundo | Texto | Contraste | Status |
|---|---|---|---|
| `#ffffff` | `#000000` | 21:1 | ✅ |
| `#e5e4e9` | `#000000` | 18.5:1 | ✅ |
| `#1cff9e` | `#000000` | 15.4:1 | ✅ |
| `#0086ff` | `#ffffff` | 3.5:1 | ⚠️ ok para texto grande |
| `#0086ff` | `#000000` | 6.0:1 | ✅ |
| `#1b415e` | `#ffffff` | 10.2:1 | ✅ |
| `#243837` | `#ffffff` | 12.8:1 | ✅ |
| `#ff8b80` | `#000000` | 7.8:1 | ✅ |

**Regra:** nunca usar texto branco sobre verde `#1cff9e` (contraste ~2.3:1, falha). Sempre texto preto sobre verde.

## Navegação por teclado

Todo elemento interativo deve ser acessível via `Tab` e ativável via `Enter` ou `Space`.

- **Links:** `<a>` nativo. Se precisar de comportamento de botão, use `<button>`.
- **Botões:** `<button type="button">` ou `type="submit"`.
- **Accordion:** usar `<button>` como trigger do `<summary>`, não `<div onClick>`.
- **Modal (se houver):** focus trap obrigatório, Escape para fechar, retorno de foco ao elemento que abriu.

### Foco visível

Nunca remover o outline sem substituir. Padrão para o projeto:

```css
*:focus-visible {
  outline: 2px solid #0086ff;
  outline-offset: 2px;
  border-radius: 4px;
}
```

Ou equivalente Tailwind: `focus-visible:ring-2 focus-visible:ring-redenec-azul focus-visible:ring-offset-2`

## Estrutura semântica HTML

- **Hierarquia de headings sem pular:** h1 → h2 → h3 → h4. Apenas um h1 por página.
- **Elementos semânticos:** `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- **Listas:** usar `<ul>` / `<ol>` para listas, não `<div>`.
- **Botões vs links:** botões fazem ações, links levam a outros lugares.

## ARIA — regras mínimas

- **`aria-label`** em botões sem texto visível (ex: botão com apenas ícone)
- **`aria-labelledby`** quando o label está em outro elemento
- **`aria-describedby`** para mensagens de erro em campos de formulário
- **`aria-expanded`** em elementos colapsáveis
- **`aria-controls`** vinculando trigger ao conteúdo controlado
- **`aria-current="page"`** em links do menu de navegação apontando para a página atual
- **`aria-live="polite"`** em regiões que recebem atualizações dinâmicas (ex: mensagens de sucesso do formulário)

**Regra de ouro:** "No ARIA is better than bad ARIA". Se o HTML semântico resolve, não adicione ARIA.

## Formulários acessíveis

Para cada campo:

```tsx
<div>
  <label htmlFor="email" className="...">
    E-mail institucional
    <span className="text-red-600" aria-label="obrigatório">*</span>
  </label>
  <input
    id="email"
    name="email"
    type="email"
    required
    aria-required="true"
    aria-invalid={!!error}
    aria-describedby={error ? 'email-error' : 'email-helper'}
    className="..."
  />
  {helperText && (
    <p id="email-helper" className="text-sm text-gray-600">
      {helperText}
    </p>
  )}
  {error && (
    <p id="email-error" role="alert" className="text-sm text-red-600">
      {error}
    </p>
  )}
</div>
```

## Imagens

- **`alt` em toda imagem.** Se for decorativa (grafismos modulares, fundo), usar `alt=""` e `role="presentation"`.
- **Imagens com texto:** evitar. Se inevitável, o `alt` deve reproduzir o texto.
- **Thumbnails de materiais:** `alt` descreve o tipo de material, não "imagem de [X]".

## Movimento e animação

- **Respeitar `prefers-reduced-motion`:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- **Animações opcionais:** qualquer motion além de transições sutis deve ter fallback estático.

## Skip link

Incluir no topo do `<main>`:

```tsx
<a
  href="#conteudo-principal"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:rounded"
>
  Pular para o conteúdo
</a>
```

## Teste rápido antes de entregar

1. Navegue pela página inteira usando apenas `Tab` + `Enter`. Consegue chegar a todos os elementos interativos?
2. Rode `axe DevTools` no navegador. Zero violations?
3. Teste com zoom do navegador em 200%. Layout quebra?
4. Teste com leitor de tela (VoiceOver no Mac, NVDA no Windows) percorrendo uma seção. Faz sentido auditivamente?

Se passa nos 4 testes, o componente está pronto para entrega.
