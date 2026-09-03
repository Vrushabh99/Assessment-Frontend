/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'

const Dashboard = styled.main`min-height: 100vh;`
const Container = styled.div`width: min(100% - 48px, 1120px); margin: 0 auto;`
const Topbar = styled.header`
  display: flex; align-items: center; justify-content: space-between; padding: 40px 0 28px;
  @media (max-width: 640px) { align-items: flex-start; flex-direction: column; gap: 20px; }
`
const Eyebrow = styled.p`
  margin: 0 0 8px; color: ${({ theme }) => theme.colors.primary}; font-size: 0.75rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
`
const UserMenu = styled.div`display: flex; align-items: center; gap: 16px; color: ${({ theme }) => theme.colors.muted};`
const TextButton = styled.button`
  border: 0; padding: 0; background: transparent; color: ${({ theme }) => theme.colors.primary}; cursor: pointer;
  font: inherit; font-weight: 600;
`
const Navigation = styled.nav`display: flex; gap: 20px; margin: 0 0 24px;`
const NavigationLink = styled(Link)`color: ${({ theme }) => theme.colors.primary}; font-weight: 600; text-decoration: none;`
const Content = styled.div`display: grid; gap: 20px;`

export function DashboardLayout({ title, role, children }) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const signOut = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <Dashboard>
      <Container>
      <Topbar>
        <div>
          <Eyebrow>Assessment Platform</Eyebrow>
          <h1>{title}</h1>
        </div>
        <UserMenu>
          <span>{role}</span>
          <TextButton type="button" onClick={signOut}>Sign out</TextButton>
        </UserMenu>
      </Topbar>
      <Navigation aria-label="Workspace navigation">
        {role === 'Administrator' ? (
          <>
            <NavigationLink to="/admin">Dashboard</NavigationLink>
            <NavigationLink to="/admin/assessments">Assessments</NavigationLink>
          </>
        ) : (
          <>
            <NavigationLink to="/candidate">Assigned assessments</NavigationLink>
            <NavigationLink to="/candidate/assessments/demo">Demo attempt</NavigationLink>
          </>
        )}
      </Navigation>
      <Content>{children}</Content>
      </Container>
    </Dashboard>
  )
}
