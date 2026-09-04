import styled from 'styled-components'

export const QuestionGridWrapper = styled.div`
  display: grid;
  gap: 12px;
  padding: 20px;
`

export const QuestionCard = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  @media (max-width: 640px) {
    align-items: flex-start;
  }
`

export const QuestionContent = styled.div`
  display: grid;
  gap: 10px;
  min-width: 0;
  flex: 1;
`

export const QuestionId = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.muted};
  font-family: monospace;
  font-weight: 500;
`

export const QuestionText = styled.h3`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

export const QuestionMetadata = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.9rem;
`

export const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const EmptyState = styled.p`
  padding: 28px 20px;
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
`
