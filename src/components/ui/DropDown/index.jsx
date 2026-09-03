import { Field, Label, Select } from './styles'

/* eslint-disable react/prop-types */
export function DropDown({ label, options, ...props }) {
  return (
    <Field>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <Select {...props}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select>
    </Field>
  )
}
