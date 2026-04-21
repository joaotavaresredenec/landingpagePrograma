---
name: guia-de-marca-redenec
description: Aplica a identidade visual oficial da Rede Nacional de Educação Cidadã (Redenec) em todos os elementos do site, incluindo cores exatas, tipografia, uso do logo, elementos gráficos modulares (círculos e linhas) e regras de aplicação sobre fundos. Usar sempre que estiver implementando qualquer componente visual, escolhendo cores, configurando o Tailwind, criando grafismos ou decidindo hierarquia visual. Esta skill é CRÍTICA — qualquer desvio quebra a consistência da marca.
---

# Skill: Guia de marca Redenec

Tokens de design extraídos do Manual de Identidade Visual oficial da Redenec (versão 2026).

## Paleta de cores — tokens exatos

### Cor principal
- **Verde Redenec:** `#1cff9e` (RGB 28 255 158 / CMYK 56 0 62 0)
  - Esta é a cor protagonista da marca. Presente no logo. Usar como cor principal de destaque, CTAs principais, elementos gráficos modulares.

### Cores secundárias
- **Azul vibrante:** `#0086ff` (RGB 0 134 255 / CMYK 76 47 0 0)
  - Usar em CTAs secundários, destaques de informação, acentos
- **Azul-petróleo:** `#1b415e` (RGB 27 65 94 / CMYK 94 72 41 29)
  - Usar em fundos escuros de seções, texto sobre fundos claros quando o preto puro for rígido demais
- **Verde-escuro (quase preto):** `#243837` (RGB 36 56 55 / CMYK 80 58 63 56)
  - Usar em fundos de alto contraste, rodapé, elementos escuros
- **Coral:** `#ff8b80` (RGB 255 139 128 / CMYK 0 57 41 0)
  - Usar com parcimônia em elementos decorativos, grafismos modulares, acentos afetivos

### Neutros
- **Cinza claro de fundo:** `#e5e4e9` (RGB 229 228 233 / CMYK 9 7 4 0)
  - Fundo padrão do site (alternativa ao branco puro)
- **Preto:** `#000000`
  - Tipografia principal, elementos estruturais, logo monocromático escuro

### Regra de uso
- **Fundo padrão do site:** `#e5e4e9` (cinza claro do manual) ou branco puro
- **Texto principal:** preto `#000000`
- **Cor de destaque/CTA primário:** verde `#1cff9e`
- **Cor de CTA secundário ou link:** azul `#0086ff`
- **Seção dark (se houver, como rodapé):** azul-petróleo `#1b415e` ou verde-escuro `#243837` com texto branco

## Tipografia

### Família única: Figtree (Google Fonts)

```typescript
// app/layout.tsx
import { Figtree } from 'next/font/google'

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-figtree',
})
```

### Pesos permitidos
- **Figtree Regular (400):** corpo de texto, parágrafos, labels
- **Figtree Bold (700):** títulos, CTAs, destaques

Não usar outros pesos (Light, Medium, Semibold, Black, Extrabold). A marca é minimalista nessa escolha.

### Escala tipográfica sugerida (mobile-first)

| Elemento | Mobile | Desktop | Peso |
|---|---|---|---|
| H1 (hero) | 36px | 64px | Bold |
| H2 (seção) | 28px | 40px | Bold |
| H3 (card) | 20px | 24px | Bold |
| Corpo | 16px | 18px | Regular |
| Microcopy | 14px | 14px | Regular |
| Botão | 16px | 16px | Bold |

Line-height:
- Títulos: 1.1-1.2
- Corpo: 1.5-1.6

## Logo

### Versões disponíveis
1. **Principal (colorida):** círculos verdes `#1cff9e` e letras n/e/c pretas, texto "Rede Nacional de Educação Cidadã" em preto
2. **Monocromática preta:** sobre fundos claros, todos os elementos em preto
3. **Monocromática branca:** sobre fundos escuros ou coloridos de alta densidade

### Regras absolutas
- **Nunca alterar as proporções** entre símbolo e texto
- **Nunca alterar as cores** da versão principal
- **Nunca distorcer, rotacionar ou aplicar efeitos** (sombra, blur, gradiente)
- **Nunca trocar a tipografia** do texto "Rede Nacional de Educação Cidadã"
- **Altura mínima de uso:** 1,5 cm (impresso) / 40px (digital)
- **Área de respiro:** equivale à altura do símbolo (módulo X). Nenhum elemento gráfico pode invadir essa área.

### Quando usar cada versão
- Fundo claro (branco, cinza `#e5e4e9`): versão principal colorida
- Fundo verde `#1cff9e`: versão preta (monocromática escura)
- Fundo azul `#0086ff`, azul-petróleo `#1b415e`, verde-escuro `#243837`: versão branca (monocromática clara)
- Fundo coral `#ff8b80`: pode usar versão preta ou versão colorida com ajuste de contraste

### Arquivo do logo
Logos em SVG devem ficar em `public/logo/`:
- `logo-principal.svg` — versão colorida
- `logo-mono-preto.svg` — versão preta
- `logo-mono-branco.svg` — versão branca
- `logo-simbolo.svg` — apenas o símbolo (n/e/c com círculos), sem o texto, para usos em favicon e compactos

## Elementos gráficos modulares (grafismos)

A marca tem uma assinatura visual única: **círculos e linhas que derivam do próprio logo**.

### Como funcionam
- Círculos sólidos de tamanhos variados
- Linhas retas conectando os círculos (ou não)
- Composições orgânicas, não geométricas rigorosas
- Representam "rede ativa e interligada"

### Regras
- **Círculos** podem usar qualquer cor da paleta (`#1cff9e`, `#0086ff`, `#ff8b80`, `#1b415e`, `#243837`)
- **Linhas** usam apenas **preto** (sobre fundos claros) ou **branco** (sobre fundos coloridos/escuros)
- **Composição livre:** densidade, tamanho e posicionamento variam conforme o contexto
- **Usar como camada decorativa** — nunca sobrepor texto legível

### Implementação em React
Criar um componente `GrafismoModular` parametrizável:

```typescript
// components/visual/GrafismoModular.tsx
type GrafismoProps = {
  variante: 'hero' | 'secao' | 'cta' | 'denso'
  corCirculos: 'verde' | 'azul' | 'coral' | 'petroleo' | 'escuro' | 'misto'
  corLinhas: 'preto' | 'branco'
  className?: string
}
```

Cada variante é uma composição pré-definida em SVG, para garantir consistência visual sem sobrecarregar a produção.

## Aplicação em seções — padrões visuais

### Hero
- Fundo: `#e5e4e9` (cinza claro) ou foto humana com overlay
- Headline: preto em Figtree Bold 64px (desktop)
- Grafismo modular no canto direito ou atrás da foto, com círculos verdes `#1cff9e`
- Botão CTA: fundo preto `#000000`, texto branco, Figtree Bold, border-radius 999px (pill) — **estilo do manual**
  - Alternativa de CTA: fundo verde `#1cff9e`, texto preto `#000000`

### Seções de conteúdo (desafios, biblioteca, orientações)
- Fundo: branco ou `#e5e4e9`
- Cards: fundo branco com borda 0.5px cinza (`#e5e4e9`) ou sem borda com sombra sutil
- Ícones: estilo linha (Lucide React), cor preta ou azul `#0086ff`

### Seção "Sobre o Programa"
- Fundo diferenciado: pode ser `#1b415e` (azul-petróleo) com texto branco, ou `#1cff9e` (verde) com texto preto — criar contraste com o resto da página

### Formulário
- Fundo: branco ou `#e5e4e9`
- Inputs: borda 1px cinza, border-radius 8px, padding 12-16px
- Input em foco: borda verde `#1cff9e` ou azul `#0086ff`
- Botão de submit: preto com texto branco OU verde `#1cff9e` com texto preto, border-radius 999px

### Rodapé
- Fundo: `#243837` (verde-escuro)
- Texto: branco
- Logo: versão monocromática branca

## Configuração do Tailwind

Adicionar ao `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        redenec: {
          verde: '#1cff9e',
          azul: '#0086ff',
          petroleo: '#1b415e',
          escuro: '#243837',
          coral: '#ff8b80',
          cinza: '#e5e4e9',
        }
      },
      fontFamily: {
        sans: ['var(--font-figtree)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'pill': '9999px',
      }
    }
  }
}
```

## Checklist antes de entregar qualquer componente visual

- [ ] Usou apenas cores da paleta oficial (hex exatos)
- [ ] Usou Figtree em Regular ou Bold — nenhum outro peso
- [ ] Logo (se presente) em versão correta para o fundo
- [ ] Grafismos modulares respeitam as regras (círculos coloridos, linhas pretas/brancas)
- [ ] Contraste texto/fundo passa WCAG AA (≥4.5:1 para corpo, ≥3:1 para títulos grandes)
- [ ] Componente é responsivo (mobile-first)
- [ ] Nada foi inventado fora do manual
