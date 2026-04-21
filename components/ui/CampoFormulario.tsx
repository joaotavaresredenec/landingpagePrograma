import React from 'react'

export type CampoFormularioProps = {
  id: string
  label: string
  required?: boolean
  error?: string
  helperText?: string
  children: React.ReactNode
  className?: string
}

/**
 * CampoFormulario — wrapper acessível com label, campo e mensagem de erro.
 * O campo filho deve aceitar id, aria-invalid e aria-describedby.
 */
export function CampoFormulario({
  id,
  label,
  required = false,
  error,
  helperText,
  children,
  className = '',
}: CampoFormularioProps) {
  const hasError = Boolean(error)
  const descriptionId = hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined

  return (
    <div className={['flex flex-col gap-1', className].join(' ')}>
      <label htmlFor={id} className="text-sm font-bold text-black">
        {label}
        {required && (
          <span className="ml-1 text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {/* Inject aria props into child via cloneElement */}
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
            id,
            'aria-invalid': hasError,
            'aria-required': required,
            'aria-describedby': descriptionId,
          })
        : children}

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
