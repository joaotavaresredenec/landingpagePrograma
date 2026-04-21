import React from 'react'

export type InputProps = {
  id: string
  label: string
  required?: boolean
  error?: string
  helperText?: string
  className?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'>

export function Input({
  id,
  label,
  required = false,
  error,
  helperText,
  className = '',
  ...rest
}: InputProps) {
  const hasError = Boolean(error)

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-bold text-black"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        id={id}
        required={required}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
        }
        className={[
          'w-full rounded-lg border px-4 py-3 text-base text-black bg-white',
          'transition-colors duration-150 placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-redenec-verde focus:border-redenec-verde',
          hasError
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300',
          className,
        ].join(' ')}
        {...rest}
      />

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
