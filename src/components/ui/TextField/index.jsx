import { ErrorMessage, Field, Input, Label, Textarea } from './styles'

/* eslint-disable react/prop-types */
export function TextField({ label, multiline = false, error = false, helperText = '', ...props }) {
  const Control = multiline ? Textarea : Input
  const handleBlur = (e) => {
    if (props.type === 'number' && e.target.value !== '') {
      const value = Number(e.target.value)
      const { min, max, onChange } = props
      let clamped = value
      if (min !== undefined && value < Number(min)) clamped = Number(min)
      if (max !== undefined && value > Number(max)) clamped = Number(max)

      if (clamped !== value) {
        e.target.value = clamped
        onChange?.(e) // sync back if this is a controlled input
      }
    }
    props.onBlur?.(e)
  }

  return (
    <Field>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <Control
        $error={error}
        aria-invalid={error || undefined}
        {...props}
        aria-label={label}
        onBlur={handleBlur}
      />
      {helperText && <ErrorMessage>{helperText}</ErrorMessage>}
    </Field>
  )
}
