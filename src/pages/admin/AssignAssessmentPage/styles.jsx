import styled from 'styled-components'

export const Page = styled.section`
  width: min(100%, 760px);
  margin: 0 auto;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 32px ${({ theme }) => theme.colors.shadow};
`

export const FormHeader = styled.header`
  margin-bottom: 24px;
  h2 { margin: 0; }
  p { margin: 8px 0 0; color: ${({ theme }) => theme.colors.muted}; }
`

export const DurationGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background};

  .MuiFormHelperText-root {
    min-height: 0;
    margin-top: 3px;
  }
`

export const Summary = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`

export const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background};
  strong { color: ${({ theme }) => theme.colors.muted}; font-size: 0.8rem; }
`

export const Form = styled.form`display: flex; flex-direction: column; gap: 24px;`
export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  @media (max-width: 480px) { flex-direction: column-reverse; }
`
