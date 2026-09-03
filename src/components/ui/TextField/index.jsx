import { Field, Input, Label, Textarea } from './styles'

/* eslint-disable react/prop-types */
export function TextField({ label, multiline = false, ...props }) {
  const Control = multiline ? Textarea : Input
  return (
    <Field>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <Control {...props} />
    </Field>
  )
}
