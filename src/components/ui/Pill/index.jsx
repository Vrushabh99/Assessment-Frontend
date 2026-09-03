import { PillContent } from './styles'

/* eslint-disable react/prop-types */
export function Pill({ children, tone = 'neutral' }) {
  return <PillContent $tone={tone}>{children}</PillContent>
}
