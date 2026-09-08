import styled from 'styled-components'

export const TabList = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  overflow-x: auto;
`

export const Tab = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 16px 16px;
  font-size: 0.92rem;
  font-weight: 500;
  font-family: inherit;
  white-space: nowrap;
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.muted)};
  border-bottom: 4px solid ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  margin-bottom: -1px;
  transition: color 0.15s ease, border-color 0.15s ease;

  &:hover {
    color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.text)};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`