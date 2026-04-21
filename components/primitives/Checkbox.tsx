import React from 'react'

export type CheckboxProps = {
  id: string
  label: React.ReactNode
  required?: boolean
  error?: string
  helperText?: string
  className?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'>

export function Checkbox({
  id,
  label,
  required = false,
  error,
  helperText,
  className = '',
  ...rest
}: CheckboxProps) {
  const hasError = Boolean(error)

  return (
    <div className={['flex flex-col gap-1', className].join(' ')}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={id}
          required={required}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          className={[
            'mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-gray-300 text-black',
            'accent-redenec-verde',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-redenec-verde focus-visible:ring-offset-2',
            hasError ? 'border-red-500' : '',
          ].join(' ')}
          {...rest}
        />
        <label htmlFor={id} className="text-sm leading-relaxed text-black cursor-pointer">
          {label}
          {required && (
            <span className="ml-1 text-red-600" aria-hidden="true">
              *
            </span>
          )}
        </label>
      </div>

      {hasError && (
        <p id={`${id}-error`} role="alert" className="ml-8 text-sm text-red-600">
          {error}
        </p>
      )}
      {!hasError && helperText && (
        <p id={`${id}-helper`} className="ml-8 text-micro text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}
