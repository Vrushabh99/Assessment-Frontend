import styled from 'styled-components'

export const Card = styled.section`
  display: grid;
  gap: 20px;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 32px ${({ theme }) => theme.colors.shadow};
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`

export const Title = styled.h2`
  margin: 0;
`

export const Muted = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
`

export const Metadata = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`

export const RulesList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: ${({ theme }) => theme.colors.muted};
  display: grid;
  gap: 6px;
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const ErrorState = styled.p`
  color: ${({ theme }) => theme.colors.danger || '#b42318'};
`
