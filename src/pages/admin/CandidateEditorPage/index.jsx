import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components'
import { candidateKeys, createCandidate, getCandidate, updateCandidate } from '../../../api/candidates'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Button } from '../../../components/ui/Button'
import { CommonLoader } from '../../../components/ui/CommonLoader'
import { TextField } from '../../../components/ui/TextField'

const Form = styled.form`
  display: grid;
  gap: 18px;
  max-width: 620px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
`
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`
const Actions = styled.div`display: flex; justify-content: flex-end; gap: 12px;`
const Error = styled.p`margin: 0; color: ${({ theme }) => theme.colors.danger};`
const Help = styled.p`margin: -8px 0 0; color: ${({ theme }) => theme.colors.muted}; font-size: 0.875rem;`

const emptyCandidate = { firstName: '', lastName: '', email: '', password: '' }

export function CandidateEditorPage() {
  const navigate = useNavigate()
  const { candidateId } = useParams()
  const queryClient = useQueryClient()
  const [values, setValues] = useState(emptyCandidate)
  const candidateQuery = useQuery({
    queryKey: candidateKeys.detail(candidateId),
    queryFn: () => getCandidate(candidateId),
    enabled: Boolean(candidateId),
  })
  const saveMutation = useMutation({
    mutationFn: (candidate) => candidateId
      ? updateCandidate({ id: candidateId, ...candidate })
      : createCandidate(candidate),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: candidateKeys.all }),
  })

  useEffect(() => {
    if (candidateQuery.data) {
      const { firstName, lastName, email } = candidateQuery.data
      setValues({ firstName, lastName, email, password: '' })
    }
  }, [candidateQuery.data])

  const updateValue = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  const handleSubmit = async (event) => {
    event.preventDefault()
    const payload = { ...values }
    if (candidateId && !payload.password) delete payload.password
    await saveMutation.mutateAsync(payload)
    navigate('/admin/candidates')
  }

  if (candidateId && candidateQuery.isLoading) return <DashboardLayout title="Edit candidate" role="Administrator"><CommonLoader label="Loading candidate..." /></DashboardLayout>
  if (candidateId && candidateQuery.isError) return <DashboardLayout title="Edit candidate" role="Administrator"><p role="alert">{candidateQuery.error.message}</p></DashboardLayout>

  const isEditing = Boolean(candidateId)
  return (
    <DashboardLayout title={isEditing ? 'Edit candidate' : 'Create candidate'} role="Administrator">
      <Form onSubmit={handleSubmit}>
        <FormGrid>
          <TextField id="candidate-first-name" label="First name" name="firstName" value={values.firstName} onChange={updateValue} required />
          <TextField id="candidate-last-name" label="Last name" name="lastName" value={values.lastName} onChange={updateValue} required />
        </FormGrid>
        <TextField id="candidate-email" label="Email address" name="email" type="email" value={values.email} onChange={updateValue} required />
        <TextField id="candidate-password" label={isEditing ? 'New password (optional)' : 'Initial password'} name="password" type="password" minLength="8" value={values.password} onChange={updateValue} required={!isEditing} />
        <Help>{isEditing ? 'Leave password blank to keep the current password.' : 'The password must contain at least 8 characters.'}</Help>
        {saveMutation.isError && <Error role="alert">{saveMutation.error.message}</Error>}
        <Actions>
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/candidates')}>Cancel</Button>
          <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving...' : isEditing ? 'Save changes' : 'Create candidate'}</Button>
        </Actions>
      </Form>
    </DashboardLayout>
  )
}
