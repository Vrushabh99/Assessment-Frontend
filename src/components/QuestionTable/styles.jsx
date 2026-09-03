import styled from 'styled-components'

export const QuestionTableWrapper = styled.div`overflow-x: auto;`
export const Table = styled.table`
  width: 100%; border-collapse: collapse; min-width: 720px;
  th, td { padding: 16px 20px; text-align: left; border-bottom: 1px solid ${({ theme }) => theme.colors.border}; }
  th { color: ${({ theme }) => theme.colors.muted}; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; }
  tr:last-child td { border-bottom: 0; }
`
export const Badge = styled.span`
  display: inline-block; border-radius: 999px; padding: 4px 10px;
  background: ${({ $status, theme }) => $status === 'Draft' ? theme.colors.primarySoft : theme.colors.successBackground};
  color: ${({ $status, theme }) => $status === 'Draft' ? theme.colors.primaryText : theme.colors.successText};
  font-size: 0.8rem; font-weight: 600;
`
export const EmptyState = styled.p`padding: 28px 20px; color: ${({ theme }) => theme.colors.muted}; text-align: center;`
