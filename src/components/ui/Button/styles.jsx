import styled from 'styled-components'

export const ButtonBase = styled.button`
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  border-radius: 8px; cursor: pointer; font: inherit; font-weight: 600; padding: 11px 16px;
  border: 1px solid ${({ $variant, theme }) => $variant === 'primary' ? theme.colors.primary : theme.colors.border};
  background: ${({ $variant, theme }) => $variant === 'primary' ? theme.colors.primary : theme.colors.surface};
  color: ${({ $variant, theme }) => $variant === 'primary' ? theme.colors.surface : theme.colors.text};
`
