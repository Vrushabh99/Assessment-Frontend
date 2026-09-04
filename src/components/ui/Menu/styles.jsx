import styled from 'styled-components'

export const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  padding: 11px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, $isOpen }) => $isOpen ? theme.colors.background : theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`