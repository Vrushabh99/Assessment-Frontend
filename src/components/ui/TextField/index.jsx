import { ErrorMessage, Field, Input, Label, Textarea } from './styles'

/* eslint-disable react/prop-types */
export function TextField({ label, multiline = false, error = false, helperText = '', ...props }) {
  const Control = multiline ? Textarea : Input
  return (
    <Field>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <Control $error={error} aria-invalid={error || undefined} {...props} />
      {helperText && <ErrorMessage>{helperText}</ErrorMessage>}
    </Field>
  )
}
