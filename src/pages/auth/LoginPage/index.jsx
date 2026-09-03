import { ROLES } from '../../../constants/roles'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../../context/AuthContext'
import { useEffect, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { TextField } from '../../../components/ui/TextField'

const CenteredPage = styled.main`
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 10px;
`
const WelcomeCard = styled.section`
  width: min(100%, 380px);
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 32px ${({ theme }) => theme.colors.shadow};
`
const Eyebrow = styled.div`
  margin: 0 0 8px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  align-items: center;
  display: flex;
  flex-direction: column;
`
const Muted = styled.p`color: ${({ theme }) => theme.colors.muted};`
const Form = styled.form`display: grid; gap: 16px; margin-top: 24px;`
const ErrorMessage = styled.p`margin: 0; color: ${({ theme }) => theme.colors.danger};`

export function LoginPage() {
  const navigate = useNavigate()
  const { user, isLoading, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && user) navigate(user.role === ROLES.ADMIN ? '/admin' : '/candidate', { replace: true })
  }, [isLoading, navigate, user])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const loggedInUser = await login({ email, password })
      navigate(loggedInUser.role === ROLES.ADMIN ? '/admin' : '/candidate', { replace: true })
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || user) return null

  return (
    <CenteredPage>
      <WelcomeCard>
        <Eyebrow>
          <img src="/big-logo.png" alt="Proctored Assessment Platform Logo" width={300} height={100} />
          Proctored Assessment Platform
        </Eyebrow>
        <h1>Log In</h1>
        <Muted>Use your account to access your assessment workspace.</Muted>
        <Form onSubmit={handleSubmit}>
          <TextField id="email" label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          <TextField id="password" label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign in'}</Button>
        </Form>
      </WelcomeCard>
    </CenteredPage>
  )
}
