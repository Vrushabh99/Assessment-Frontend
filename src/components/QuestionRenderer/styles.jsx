import styled, { css } from 'styled-components'

export const QuestionCard = styled.article`
  display: grid;
  gap: 16px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
`

export const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
`

export const QuestionTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
`

export const QuestionMeta = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  gap: 6px;
  font-size: 0.875rem;
  white-space: nowrap;
`

export const Options = styled.div`
  display: grid;
  gap: 10px;
`

export const Option = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: 10px;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};

  ${({ $selected, theme }) => $selected && css`
    border-color: ${theme.colors.primary};
    background: ${theme.colors.primarySoft};
  `}

  ${({ $correct, theme }) => $correct && css`
    border-color: ${theme.colors.successText};
    background: ${theme.colors.successBackground};
  `}

  ${({ $incorrect, theme }) => $incorrect && css`
    border-color: ${theme.colors.danger};
  `}
`

export const AnswerInput = styled.textarea`
  width: 100%;
  min-height: 110px;
  padding: 12px;
  resize: vertical;
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: 10px;
  font: inherit;
`

export const Feedback = styled.p`
  margin: 0;
  color: ${({ $correct, theme }) => ($correct ? theme.colors.successText : theme.colors.danger)};
  font-size: 0.875rem;
  font-weight: 700;
`

export const ScoreField = styled.input`
  width: 90px;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: 8px;
  font: inherit;
`
