import React from 'react'
import { ChevronDown } from 'lucide-react'

export type SelectOption = {
  value: string
  label: string
}

export type SelectProps = {
  id: string
  label: string
  options: SelectOption[]
  required?: boolean
  error?: string
  helperText?: string
  className?: string
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'id'>

export function Select({
  id,
  label,
  options,
  required = false,
  error,
  helperText,
  className = '',
  ...rest
}: SelectProps) {
  const hasError = Boolean(error)

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-bold text-black">
        {label}
        {required && (
          <span className="ml-1 text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <select
          id={id}
          required={required}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          className={[
            'w-full appearance-none rounded-lg border px-4 py-3 text-base text-black bg-white pr-10',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-redenec-verde focus:border-redenec-verde',
            hasError
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300',
            className,
          ].join(' ')}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          aria-hidden="true"
        />
      </div>

      {hasError && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      {!hasError && helperText && (
        <p id={`${id}-helper`} className="text-micro text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}
