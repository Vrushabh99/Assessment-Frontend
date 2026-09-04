import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel, Grid, Pagination, Stack, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { apiRequest } from '../../../api/client'
import { assignAssessment, assignmentKeys, getAssignment, updateAssignment } from '../../../api/assignments'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Button } from '../../../components/ui/Button'
import { CommonLoader } from '../../../components/ui/CommonLoader'
import { DropDown } from '../../../components/ui/DropDown'
import { TextField } from '../../../components/ui/TextField'
import { Actions, DurationGroup, Form, FormHeader, Page } from '../AssignAssessmentPage/styles'

const defaultViolationLimits = { tab_switch: 3, window_blur: 3, fullscreen_exit: 2, copy: 2, paste: 2, right_click: 5 }
const violationLabels = { tab_switch: 'Tab switch', window_blur: 'Window blur', fullscreen_exit: 'Fullscreen exit', copy: 'Copy', paste: 'Paste', right_click: 'Right click' }
const hourOptions = [{ value: '', label: 'Select hours' }, ...Array.from({ length: 25 }, (_, value) => ({ value: String(value), label: String(value) }))]
const minuteOptions = [{ value: '', label: 'Select minutes' }, ...Array.from({ length: 60 }, (_, value) => ({ value: String(value), label: String(value) }))]

const toDateTimeInput = (value) => value ? new Date(value).toISOString().slice(0, 16) : ''

export function AssignmentEditPage() {
  const navigate = useNavigate()
  const { assignmentId } = useParams()
  const query = useQuery({ queryKey: assignmentKeys.detail(assignmentId), queryFn: () => getAssignment(assignmentId) })
  const [durationHours, setDurationHours] = useState('')
  const [durationMinutes, setDurationMinutes] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [description, setDescription] = useState('')
  const [violationLimits, setViolationLimits] = useState(defaultViolationLimits)
  const [candidateOptions, setCandidateOptions] = useState([])
  const [selectedCandidates, setSelectedCandidates] = useState([])
  const [candidatePage, setCandidatePage] = useState(1)
  const [candidateError, setCandidateError] = useState('')
  const candidatesFetched = useRef(false)
  const candidatesPerPage = 8
  const visibleCandidates = useMemo(() => candidateOptions.slice((candidatePage - 1) * candidatesPerPage, candidatePage * candidatesPerPage), [candidateOptions, candidatePage])

  useEffect(() => {
    const assignment = query.data?.assignment || query.data
    if (!assignment) return
    setDurationHours(String(Math.floor(assignment.durationMinutes / 60)))
    setDurationMinutes(String(assignment.durationMinutes % 60))
    setExpiresAt(toDateTimeInput(assignment.expiresAt))
    setDescription(assignment.description || '')
    setViolationLimits({ ...defaultViolationLimits, ...assignment.violationLimits })
    setSelectedCandidates((assignment.students || []).map((student) => student.candidate).filter(Boolean))
  }, [query.data])

  useEffect(() => {
    if (candidatesFetched.current) return
    candidatesFetched.current = true
    apiRequest('/admin/candidates')
      .then((response) => {
        const candidates = response.data?.candidates || response.data?.users || response.data || []
        setCandidateOptions(Array.isArray(candidates) ? candidates : [])
      })
      .catch((error) => setCandidateError(error.message))
  }, [])

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { newCandidates, ...assignmentUpdate } = payload
      await updateAssignment(assignmentUpdate)
      if (newCandidates.length) {
        return assignAssessment({
          assessmentId: assessment._id || assessment.id,
          candidateIds: newCandidates.map((candidate) => candidate._id),
          durationMinutes: assignmentUpdate.durationMinutes,
          violationLimits: assignmentUpdate.violationLimits,
          expiresAt: assignmentUpdate.expiresAt,
          description: assignmentUpdate.description,
        })
      }
      return null
    },
    onSuccess: () => navigate('/admin/assignments'),
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    const existingCandidateIds = new Set((assignment.students || []).map((student) => student.candidate?._id || student.candidate?.id))
    mutation.mutate({
      id: assignmentId,
      durationMinutes: (Number(durationHours || 0) * 60) + Number(durationMinutes || 0),
      violationLimits,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      description,
      newCandidates: selectedCandidates.filter((candidate) => !existingCandidateIds.has(candidate._id || candidate.id)),
    })
  }

  const assignment = query.data?.assignment || query.data
  const assessment = assignment?.assessmentId || {}
  if (query.isLoading) return <DashboardLayout title="Edit assignment" role="Administrator"><CommonLoader label="Loading assignment..." /></DashboardLayout>
  if (query.isError) return <DashboardLayout title="Edit assignment" role="Administrator"><Typography color="error">{query.error.message}</Typography></DashboardLayout>

  return (
    <DashboardLayout title="Edit assignment" role="Administrator">
      <Page>
        <FormHeader>
          <div>
            <h2>{assessment.title || 'Edit assignment'}</h2>
            <p>Update assignment settings for this assessment.</p>
          </div>
        </FormHeader>
        <Form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <DurationGroup>
              <Typography variant="subtitle2">Test duration</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={2.5}><DropDown id="duration-hours" label="Hours" value={durationHours} onChange={(event) => setDurationHours(event.target.value)} options={hourOptions} /></Grid>
                <Grid item xs={6} sm={2.5}><DropDown id="duration-minutes" label="Minutes" value={durationMinutes} onChange={(event) => setDurationMinutes(event.target.value)} options={minuteOptions} /></Grid>
                <Grid item xs={12} sm={5}><TextField type="datetime-local" label="Expires at (optional)" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} /></Grid>
              </Grid>
            </DurationGroup>
            <TextField multiline rows={2} label="Description (optional)" value={description} onChange={(event) => setDescription(event.target.value)} />
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>Violation limits (optional)</Typography></AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {Object.keys(defaultViolationLimits).map((key) => <Grid item xs={12} sm={6} key={key}><TextField type="number" label={violationLabels[key]} value={violationLimits[key]} onChange={(event) => setViolationLimits((current) => ({ ...current, [key]: Number(event.target.value) }))} min={0} /></Grid>)}
                </Grid>
              </AccordionDetails>
            </Accordion>
            <div>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Add candidates</Typography>
              {candidateError && <Typography color="error" variant="caption">{candidateError}</Typography>}
              <Stack sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 1 }}>
                {visibleCandidates.map((candidate) => (
                  <FormControlLabel
                    key={candidate._id}
                    control={(
                      <Checkbox
                        checked={selectedCandidates.some((selected) => selected._id === candidate._id)}
                        onChange={(event) => setSelectedCandidates((current) => event.target.checked
                          ? [...current, candidate]
                          : current.filter((selected) => selected._id !== candidate._id))}
                      />
                    )}
                    label={`${candidate.firstName || candidate.name || ''} ${candidate.lastName || ''} (${candidate.email || 'No email'})`}
                  />
                ))}
                {!visibleCandidates.length && <Typography sx={{ p: 2 }} color="text.secondary">No candidates available.</Typography>}
              </Stack>
              {candidateOptions.length > candidatesPerPage && (
                <Pagination count={Math.ceil(candidateOptions.length / candidatesPerPage)} page={candidatePage} onChange={(_, page) => setCandidatePage(page)} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }} />
              )}
            </div>
            {mutation.isError && <Typography color="error" role="alert">{mutation.error.message}</Typography>}
          </Stack>
          <Actions>
            <Button type="button" variant="secondary" disabled={mutation.isPending} onClick={() => navigate('/admin/assignments')}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save changes'}</Button>
          </Actions>
        </Form>
      </Page>
    </DashboardLayout>
  )
}
