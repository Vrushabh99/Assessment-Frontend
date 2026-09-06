import styled from 'styled-components'

export const AssessmentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;

  h2 {
    margin: 0;
  }

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
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

  @media (max-width: 560px) {
    width: 100%;
    margin-left: 0;
  }
`