import styled from 'styled-components'

export const AssessmentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  h2 {
    margin: 0;
  }

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
  }
`

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  min-width: 0;
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  justify-content: flex-end;
  @media (max-width: 560px) {
    width: 100%;
    margin-left: 0;
  }
`

export const Card = styled.section`
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

export const Muted = styled.div`color: ${({ theme }) => theme.colors.muted};`
export const Meta = styled.div`display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin: 8px 0px;`
export const QuestionList = styled.div`display: grid; gap: 16px;`