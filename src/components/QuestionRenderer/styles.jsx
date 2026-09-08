import styled, { css } from 'styled-components'

export const green = 'rgba(40, 167, 69, 1)';
export const red = 'rgba(220, 53, 69, 1)';

export const QuestionCard = styled.article`
  display: grid;
  gap: 16px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  @media(max-width: 640px) {
    gap: 10px;
    padding: 16px 8px;
  }
`

export const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  flex-wrap: wrap;
`

export const QuestionTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  max-width: calc(100% - 250px);
  @media(max-width: 760px) {
    max-width: 100%;
  }
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

export const OptionWrapper = styled.div`
  display: flex;
  gap: 10px;
`

export const CorrectIncorrectWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 24px;
`;

export const Option = styled.label`
  display: flex;
  width: 100%;
  align-items: center;
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
    border: 2px solid ${theme.colors.successText};
    background: ${theme.colors.successBackground};
  `}

  ${({ $incorrect, theme }) => $incorrect && css`
     border: 2px solid ${theme.colors.danger};
  `}
`

export const OptionText = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
`;

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
