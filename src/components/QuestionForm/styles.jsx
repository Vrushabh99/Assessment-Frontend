import { Cancel, CheckCircle } from '@mui/icons-material';
import styled from 'styled-components'

export const green = 'rgba(40, 167, 69, 1)';
export const red = 'rgba(220, 53, 69, 1)';

export const CorrectIcon = () => <CheckCircle sx={{ fill: green }} />
export const InCorrectIcon = () => <Cancel sx={{ fill: red }} />
export const FormPage = styled.section`
  width: min(100%, 680px); margin: 0 auto; border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px; background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 32px ${({ theme }) => theme.colors.shadow};
`
export const FormHeader = styled.div`
  display: flex; flex-direction: column; flex-wrap: wrap;
  padding: 16px; border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 8px
`
export const FormHeaderContent = styled.div`
  display: flex; align-items: center; justify-content: space-between; width: 100%; flex-wrap: wrap;
`;
export const Form = styled.form`display: flex; flex-direction: column; gap: 18px; padding: 24px;`
export const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 16px;
`
export const Grid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
`;

export const OptionRow = styled.div`
  display: flex; align-items: center; gap: 6px; margin-bottom: 10px; width: 100%;
`
export const OptionIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
`;
export const CheckboxLabel = styled.label`display: flex; align-items: center; gap: 6px; color: ${({ theme }) => theme.colors.muted}; font-size: 0.85rem; white-space: nowrap;`
export const SectionHeader = styled.div`display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px;`
export const SectionActions = styled.div`display: flex; align-items: center; justify-content: flex-end; margin-left: auto;`
export const ValidationMessage = styled.p`margin: 0; color: ${({ theme }) => theme.colors.danger};`
export const Actions = styled.div`display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 12px;`
