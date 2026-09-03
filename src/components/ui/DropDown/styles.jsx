import styled from 'styled-components'

export const Field = styled.div`display: grid; gap: 6px;`
export const Label = styled.label`font-weight: 600;`
export const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.inputBorder}; border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface}; font: inherit; padding: 10px 12px;
`
