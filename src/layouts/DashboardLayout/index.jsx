/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { theme } from '../../styles/theme'
import { Brand, Container, Content, Dashboard, Eyebrow, Navigation, NavigationLink, PageHeading, Topbar, UserInfo, UserMenu } from './styles'

export function DashboardLayout({ title, role, hideNavigation, children }) {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [profileAnchor, setProfileAnchor] = useState(null)

  const signOut = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <Dashboard>
      <Container>
        <Topbar>
          <Brand to={role === 'Administrator' ? '/admin' : '/candidate'}>
            <img src="/logo.svg" alt="" />
            <strong>Procteria Assessment Platform</strong>
          </Brand>
          <UserMenu>
            <IconButton
              aria-label="Open profile menu"
              aria-controls={profileAnchor ? 'profile-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(profileAnchor)}
              onClick={(event) => setProfileAnchor(event.currentTarget)}
              sx={{
                p: 0.25,
                '&:focus-visible': { outline: '3px solid', outlineColor: theme.colors.primarySoft },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  border: '3px solid',
                  borderColor: theme.colors.surface,
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryText})`,
                  boxShadow: `0 0 0 1px ${theme.colors.border}, 0 4px 10px ${theme.colors.shadow}`,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}
              >
                {(user?.firstName?.[0] || role[0]).toUpperCase()}
                {(user?.lastName?.[0] || '').toUpperCase()}
              </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <UserInfo>
                <strong>{user ? `${user.firstName} ${user.lastName}` : role}</strong>
                <span>{role}</span>
              </UserInfo>
            </Box>
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={() => setProfileAnchor(null)}
              slotProps={{ paper: { sx: { mt: 1.5, minWidth: 220, borderRadius: 2, boxShadow: `0 12px 30px ${theme.colors.shadow}` } } }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2">{user ? `${user.firstName} ${user.lastName}` : role}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.email || role}</Typography>
              </Box>
              <MenuItem onClick={signOut} sx={{ color: theme.colors.danger, fontWeight: 700 }}>Sign out</MenuItem>
            </Menu>
          </UserMenu>
        </Topbar>
        {!hideNavigation && (
          <>
        <PageHeading>
          <Eyebrow>{role} workspace</Eyebrow>
          <h1>{title}</h1>
        </PageHeading>
          <Navigation aria-label="Workspace navigation">
          {role === 'Administrator' ? (
            <>
              <NavigationLink to="/admin" end>Dashboard</NavigationLink>
              <NavigationLink to="/admin/candidates">Candidates</NavigationLink>
              <NavigationLink to="/admin/questions">Questions</NavigationLink>
              <NavigationLink to="/admin/assessments">Assessments</NavigationLink>
              <NavigationLink to="/admin/assignments">Assignments</NavigationLink>
            </>
          ) : (
            <>
              <NavigationLink to="/candidate">Assigned assessments</NavigationLink>
              <NavigationLink to="/candidate/assessments/demo">Demo attempt</NavigationLink>
            </>
        )}
        </Navigation>
        </>
          )}
        <Content>{children}</Content>
      </Container>
    </Dashboard>
  )
}
