---
name: componentes-landing-institucional
description: Arquitetura e implementação de componentes React para uma landing page institucional usando Next.js 14+ App Router, TypeScript e Tailwind CSS. Inclui padrões de design atômico, estrutura de pastas, nomenclatura e convenções de props. Usar ao criar qualquer componente visual do projeto, decidir hierarquia de pastas ou definir contratos de props entre componentes.
---

# Skill: Componentes de landing page institucional

Padrões de arquitetura e implementação de componentes.

## Arquitetura atômica

Organizar `components/` em quatro níveis:

```
components/
├── primitives/        ← elementos básicos estilizados
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   ├── Textarea.tsx
│   └── Card.tsx
├── visual/            ← elementos visuais da marca
│   ├── Logo.tsx
│   ├── GrafismoModular.tsx
│   ├── ParceirosStrip.tsx
│   └── IconeMaterial.tsx
├── sections/          ← seções completas da landing
│   ├── Hero.tsx
│   ├── Desafios.tsx
│   ├── BibliotecaPreview.tsx
│   ├── Orientacoes.tsx
│   ├── SobrePrograma.tsx
│   ├── Formulario.tsx
│   └── Rodape.tsx
└── ui/                ← componentes compostos reutilizáveis
    ├── Accordion.tsx
    ├── CardMaterial.tsx
    ├── CardDesafio.tsx
    └── CampoFormulario.tsx
```

## Convenções de nomes

- **Nomes de componentes em português** (exceto termos técnicos universais como `Button`, `Input`). Ex: `Hero`, `Rodape`, `CardMaterial`, `Formulario`.
- **Arquivos em PascalCase** (`CardMaterial.tsx`)
- **Variáveis, funções e props em inglês** (`isOpen`, `onSubmit`, `isLoading`) para manter aderência aos padrões do ecossistema React/Next.
- **Tipos e interfaces em inglês**, sempre exportados junto do componente

Exemplo:

```typescript
// components/ui/CardMaterial.tsx
export type CardMaterialProps = {
  titulo: string
  descricao: string
  icone: LucideIcon
  onAcessar: () => void
}

export function CardMaterial({ titulo, descricao, icone: Icone, onAcessar }: CardMaterialProps) {
  // ...
}
```

## Primitivos — contratos

### Button
```typescript
type ButtonProps = {
  variant: 'primary' | 'secondary' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  asLink?: string  // renderiza como <a> se presente
}
```

Variantes mapeadas para o manual de marca:
- `primary`: fundo preto, texto branco, border-radius pill
- `secondary`: fundo verde `#1cff9e`, texto preto, border-radius pill
- `ghost`: sem fundo, borda 1px preta, texto preto

### Input, Select, Checkbox, Textarea
Todos aceitam:
```typescript
type FieldProps = {
  id: string
  label: string
  required?: boolean
  error?: string
  helperText?: string
  // + props nativos do elemento HTML
}
```

## Seções — padrão de implementação

Cada arquivo em `sections/` exporta uma função que recebe apenas os props realmente dinâmicos. Conteúdo textual estático fica dentro do componente, mas vem de constantes importadas de `config/copy.ts` (para facilitar revisão do Copywriter).

Exemplo:

```typescript
// config/copy.ts
export const copyHero = {
  headline: 'Sua rede aderiu ao Programa. E agora?',
  subheadline: 'A Redenec, parceira institucional do MEC...',
  ctaLabel: 'Quero acesso aos materiais',
}

// components/sections/Hero.tsx
import { copyHero } from '@/config/copy'

export function Hero() {
  return (
    <section className="...">
      <h1>{copyHero.headline}</h1>
      {/* ... */}
    </section>
  )
}
```

Isso permite que o Copywriter edite `copy.ts` sem tocar em JSX.

## Responsividade

Usar as breakpoints padrão do Tailwind:
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px
- `2xl:` 1536px

**Abordagem mobile-first:** classes sem prefixo são mobile; usar prefixos para incrementos em telas maiores.

```tsx
<h1 className="text-4xl md:text-5xl lg:text-7xl">
  {/* 36px mobile, 48px tablet, 72px desktop */}
</h1>
```

## Container e largura máxima

Todo conteúdo respeita um container centralizado:

```tsx
<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
  {/* conteúdo */}
</div>
```

`max-w-6xl` = 1152px. Em telas maiores, as seções com grafismos podem extrapolar (decorativos), mas o conteúdo textual fica contido.

## Acessibilidade obrigatória em componentes interativos

- Todo `<button>` tem `aria-label` se não tiver texto visível
- Todo `<input>` tem `<label htmlFor>` ou `aria-label`
- Elementos colapsáveis (Accordion) usam `aria-expanded` e `aria-controls`
- Foco visível: nunca remover o outline sem substituir por um anel customizado com contraste adequado
- Estrutura de heading (h1 → h2 → h3) sem pular níveis

## Padrões de estilo Tailwind

- **Usar classes utilitárias diretamente** no JSX. Não criar muitos componentes wrapper só por estilo.
- **Extrair para componente** quando um padrão repete 3+ vezes.
- **Evitar `@apply` em CSS custom** — preferir classes inline ou componentes.
- **Usar `clsx` ou `cn`** (utility do shadcn) para classes condicionais.

## Nomes de imports

Usar path aliases configurados no `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```

Então: `import { Button } from '@/components/primitives/Button'`
