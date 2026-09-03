import styled from 'styled-components'

export const Field = styled.div`display: grid; gap: 6px;`
export const Label = styled.label`font-weight: 600;`
const Control = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.inputBorder}; border-radius: 8px;
  font: inherit; padding: 10px 12px;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; outline: 2px solid ${({ theme }) => theme.colors.primarySoft}; }
`
export const Input = Control
export const Textarea = styled(Control).attrs({ as: 'textarea' })`resize: vertical;`
