import styled from 'styled-components'

export const FormPage = styled.section`
  width: min(100%, 680px); margin: 0 auto; border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px; background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 32px ${({ theme }) => theme.colors.shadow};
`
export const FormHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px; border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`
export const Form = styled.form`display: flex; flex-direction: column; gap: 18px; padding: 24px;`
export const FormGrid = styled.div`
  display: flex; flex-wrap: wrap; gap: 16px;
  & > * { flex: 1 1 190px; min-width: 0; }
`
export const OptionRow = styled.div`
  display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 10px;
  & > *:nth-child(2) { flex: 1 1 220px; min-width: 0; }
`
export const CheckboxLabel = styled.label`display: flex; align-items: center; gap: 6px; color: ${({ theme }) => theme.colors.muted}; font-size: 0.85rem; white-space: nowrap;`
export const ValidationMessage = styled.p`margin: 0; color: ${({ theme }) => theme.colors.danger};`
export const Actions = styled.div`display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 12px;`
