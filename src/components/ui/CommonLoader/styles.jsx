import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

export const LoaderWrapper = styled.div`
  display: flex;
  min-height: 160px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${({ theme }) => theme.colors.muted};
`

export const Loader = styled.span`
  width: 24px;
  height: 24px;
  border: 3px solid ${({ theme }) => theme.colors.primarySoft};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`

export const LoaderLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
`
