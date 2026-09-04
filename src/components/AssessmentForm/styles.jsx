import styled from 'styled-components'
import { IconButton } from '@mui/material'

export const FormPage = styled.section`
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
`
export const FormHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
  p { margin: 8px 0 0; color: ${({ theme }) => theme.colors.muted}; }
  @media (max-width: 640px) { flex-direction: column; }
`
export const HeaderActions = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  > div { min-width: 130px; }
  @media (max-width: 640px) {
    align-items: stretch;
    width: 100%;
    justify-content: space-between;
  }
`
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`
export const SelectedCount = styled.p`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0 0 8px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
  font-weight: 600;
  span { color: ${({ theme }) => theme.colors.primaryText}; }
  @media (max-width: 560px) { align-items: flex-start; flex-direction: column; gap: 4px; }
`
export const SelectedQuestions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primarySoft};
`
export const SelectedQuestionsHeader = styled.strong`
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: 0.85rem;
`
export const SelectedQuestion = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  @media (max-width: 560px) { align-items: flex-start; flex-direction: column; }
`
export const DeleteButton = styled(IconButton)`
  flex: 0 0 auto;
  color: ${({ theme }) => theme.colors.danger} !important;
  &:hover { background: ${({ theme }) => theme.colors.background} !important; }
  &:focus-visible { outline: 3px solid ${({ theme }) => theme.colors.primarySoft}; outline-offset: 2px; }
`
export const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 420px;
  margin-top: 12px;
  overflow-y: auto;
`
export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
  @media (max-width: 480px) { justify-content: space-between; }
`
export const QuestionOption = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border: 1px solid ${({ $selected, theme }) => $selected ? theme.colors.primary : theme.colors.border};
  border-radius: 10px;
  background: ${({ $selected, theme }) => $selected ? theme.colors.primarySoft : theme.colors.surface};
  cursor: pointer;
  input { margin-top: 3px; accent-color: ${({ theme }) => theme.colors.primary}; }
`
export const QuestionText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 4px;
  strong { color: ${({ theme }) => theme.colors.primaryText}; font-size: 0.75rem; }
  span { color: ${({ theme }) => theme.colors.text}; }
`
export const QuestionMeta = styled.span`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`
export const EmptyState = styled.p`
  padding: 20px;
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
`
export const ValidationMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.85rem;
  font-weight: 600;
`
export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  @media (max-width: 480px) { flex-direction: column-reverse; }
`
