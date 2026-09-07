import styled from "styled-components"

export const Card = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 32px ${({ theme }) => theme.colors.shadow};

  @media(max-width: 640px) {
    gap: 10px;
    padding: 20px 10px;
  }
`