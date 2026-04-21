'use client'

import React, { useState, useId } from 'react'
import { ChevronDown } from 'lucide-react'

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
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        id={triggerId}
        type="button"
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={[
          'flex w-full items-center justify-between gap-4 py-5 text-left',
          'text-base font-bold text-black transition-colors duration-150',
          'hover:text-redenec-petroleo',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde focus-visible:ring-offset-2 rounded-sm',
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
        className={[
          'overflow-hidden transition-all duration-300',
          isOpen ? 'pb-5' : '',
        ].join(' ')}
      >
        <div className="prose prose-sm max-w-none text-base leading-relaxed text-gray-700 whitespace-pre-wrap">
          {item.resposta}
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
    <div className={['divide-y divide-gray-200 rounded-2xl bg-white shadow-sm border border-gray-100', className].join(' ')}>
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
