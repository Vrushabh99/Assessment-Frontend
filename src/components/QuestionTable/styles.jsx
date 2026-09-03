import styled from 'styled-components'

export const QuestionTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`
export const Table = styled.table`
  width: 100%; border-collapse: collapse; min-width: 720px;
  th, td {
    padding: 16px 20px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    white-space: nowrap;
  }
  td:nth-child(2) {
    max-width: 360px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }
  th { color: ${({ theme }) => theme.colors.muted}; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; }
  tr:last-child td { border-bottom: 0; }
  @media (max-width: 640px) {
    min-width: 680px;
    th, td { padding: 12px 14px; }
    td:nth-child(2) { max-width: 240px; }
  }
`
export const EmptyState = styled.p`padding: 28px 20px; color: ${({ theme }) => theme.colors.muted}; text-align: center;`
