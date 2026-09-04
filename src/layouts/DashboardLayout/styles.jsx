import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

export const Dashboard = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`

export const Container = styled.div`
  width: min(100% - 48px, 1120px);
  margin: 0 auto;
  @media (max-width: 640px) { width: min(100% - 32px, 1120px); }
`

export const Topbar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  @media (max-width: 640px) {
    gap: 12px;
    padding: 16px 0;
  }
`

export const Brand = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  text-decoration: none;
  img {
    display: grid;
    width: 36px;
    height: 36px;
    place-items: center;
    object-fit: contain;
  }
`

export const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.colors.muted};
  @media (max-width: 640px) {
    gap: 8px;
  }
  @media (max-width: 480px) {
    flex: 0 0 auto;
  }
`

export const UserInfo = styled.div`
  display: flex;
  min-width: 120px;
  flex-direction: column;
  gap: 2px;
  strong { color: ${({ theme }) => theme.colors.text}; font-size: 0.85rem; }
  span { font-size: 0.75rem; }
  @media (max-width: 480px) {
    min-width: 0;
    strong { max-width: 84px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    span { display: none; }
  }
`

export const PageHeading = styled.div`
  padding: 16px 0 16px;
`

export const Eyebrow = styled.p`
  margin: 0 0 8px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const Navigation = styled.nav`
  display: flex;
  gap: 6px;
  margin: 0 0 28px;
  overflow-x: auto;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`

export const NavigationLink = styled(NavLink)`
  flex: 0 0 auto;
  padding: 10px 14px 12px;
  border-bottom: 2px solid transparent;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  &.active {
    border-bottom-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryText};
  }
`

export const Content = styled.div`
  display: grid;
  gap: 20px;
  padding-bottom: 40px;
`
