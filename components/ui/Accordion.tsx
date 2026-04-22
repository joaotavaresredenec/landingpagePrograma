'use client'

import React, { useState, useId } from 'react'
import { ChevronDown } from 'lucide-react'

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*([^*]+)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-bold text-gray-900">{part}</strong> : part
  )
}

function RichText({ text }: { text: string }) {
  const blocks = text.split('\n\n')
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const lines = block.split('\n')
        // Numbered list block
        if (lines.every((l) => /^\d+\.\s/.test(l.trim()) || l.trim() === '')) {
          return (
            <ol key={i} className="list-decimal list-inside space-y-1 pl-1">
              {lines.filter(Boolean).map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^\d+\.\s/, ''))}</li>
              ))}
            </ol>
          )
        }
        // Bullet list block
        if (lines.every((l) => /^[-•]\s/.test(l.trim()) || l.trim() === '')) {
          return (
            <ul key={i} className="list-disc list-inside space-y-1 pl-1">
              {lines.filter(Boolean).map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^[-•]\s/, ''))}</li>
              ))}
            </ul>
          )
        }
        // Mixed block with some list items
        const hasListItems = lines.some((l) => /^(\d+\.|[-•])\s/.test(l.trim()))
        if (hasListItems) {
          return (
            <div key={i} className="space-y-1">
              {lines.filter(Boolean).map((l, j) => {
                if (/^\d+\.\s/.test(l.trim())) {
                  return <div key={j} className="flex gap-2"><span className="shrink-0 font-bold">{l.match(/^(\d+)\./)?.[1]}.</span><span>{renderInline(l.replace(/^\d+\.\s/, ''))}</span></div>
                }
                if (/^[-•]\s/.test(l.trim())) {
                  return <div key={j} className="flex gap-2 pl-1"><span className="shrink-0">—</span><span>{renderInline(l.replace(/^[-•]\s/, ''))}</span></div>
                }
                return <p key={j}>{renderInline(l)}</p>
              })}
            </div>
          )
        }
        // Normal paragraph
        return <p key={i}>{renderInline(block)}</p>
      })}
    </div>
  )
}

export type AccordionItem = {
  pergunta: string
  resposta: string
}

export type AccordionProps = {
  itens: AccordionItem[]
  allowMultiple?: boolean
  className?: string
}

type AccordionItemProps = {
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
  triggerId: string
  panelId: string
}

function AccordionItemComponent({
  item,
  isOpen,
  onToggle,
  triggerId,
  panelId,
}: AccordionItemProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle()
    }
  }

  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      <button
        id={triggerId}
        type="button"
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={[
          'flex w-full items-center justify-between gap-4 px-6 py-5 text-left',
          'text-base font-bold text-black transition-colors duration-150',
          'hover:text-redenec-petroleo',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde focus-visible:ring-inset',
        ].join(' ')}
      >
        <span>{item.pergunta}</span>
        <ChevronDown
          size={20}
          aria-hidden="true"
          className={[
            'shrink-0 text-redenec-petroleo transition-transform duration-300',
            isOpen ? 'rotate-180' : 'rotate-0',
          ].join(' ')}
        />
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!isOpen}
        className={isOpen ? 'px-6 pb-6' : ''}
      >
        <div className="prose prose-sm max-w-none text-base leading-relaxed text-gray-700">
          <RichText text={item.resposta} />
        </div>
      </div>
    </div>
  )
}

export function Accordion({ itens, allowMultiple = false, className = '' }: AccordionProps) {
  const uid = useId()
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggle = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        if (!allowMultiple) next.clear()
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className={['space-y-3', className].join(' ')}>
      {itens.map((item, i) => (
        <AccordionItemComponent
          key={i}
          item={item}
          isOpen={openItems.has(i)}
          onToggle={() => toggle(i)}
          triggerId={`${uid}-trigger-${i}`}
          panelId={`${uid}-panel-${i}`}
        />
      ))}
    </div>
  )
}
