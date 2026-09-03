import { ButtonBase } from './styles'

/* eslint-disable react/prop-types */
export function Button({ variant = 'primary', icon, children, ...props }) {
  return <ButtonBase $variant={variant} {...props}>{icon && <span aria-hidden="true">{icon}</span>}{children}</ButtonBase>
}
