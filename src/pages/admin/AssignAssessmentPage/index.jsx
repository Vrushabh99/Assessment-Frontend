import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Pagination,
  Snackbar,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { apiRequest } from '../../../api/client'
import { assessmentKeys, getAssessment } from '../../../api/assessments'
import { assignAssessment, assignmentKeys, getAssignment, updateAssignment } from '../../../api/assignments'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Button } from '../../../components/ui/Button'
import { CommonLoader } from '../../../components/ui/CommonLoader'
import { DropDown } from '../../../components/ui/DropDown'
import { TextField } from '../../../components/ui/TextField'
import { Form, FormHeader, Page, Actions, Summary, SummaryItem, DurationGroup } from './styles'
import { useQuery } from '@tanstack/react-query'

const defaultViolationLimits = { tab_switch: 3, window_blur: 3, fullscreen_exit: 2, copy: 2, paste: 2, right_click: 5 }
const violationLabels = { tab_switch: 'Tab switch', window_blur: 'Window blur', fullscreen_exit: 'Fullscreen exit', copy: 'Copy', paste: 'Paste', right_click: 'Right click' }
const hourOptions = [{ value: '', label: 'Select hours' }, ...Array.from({ length: 25 }, (_, value) => ({ value: String(value), label: String(value) }))]
const minuteOptions = [{ value: '', label: 'Select minutes' }, ...Array.from({ length: 60 }, (_, value) => ({ value: String(value), label: String(value) }))]

const toDateTimeInput = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (part) => String(part).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const normalizeCandidates = (payload) => {
  const candidates = payload?.candidates || payload?.users || payload || []
  return Array.isArray(candidates) ? candidates : []
}

export function AssignAssessmentPage() {
  const navigate = useNavigate()
  const { assessmentId, assignmentId } = useParams()
  const isEdit = Boolean(assignmentId)
  const assignmentQuery = useQuery({
    queryKey: assignmentKeys.detail(assignmentId),
    queryFn: () => getAssignment(assignmentId),
    enabled: isEdit,
  })
  const fetchedCandidates = useRef(false)
  const [candidateOptions, setCandidateOptions] = useState([])
  const [selectedCandidates, setSelectedCandidates] = useState([])
  const [candidatePage, setCandidatePage] = useState(1)
  const [durationHours, setDurationHours] = useState('')
  const [durationMinutes, setDurationMinutes] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [description, setDescription] = useState('')
  const [violationLimits, setViolationLimits] = useState(defaultViolationLimits)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [candidateLoading, setCandidateLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [step, setStep] = useState(0)
  const assignmentResponse = assignmentQuery.data
  const assignment = assignmentResponse?.assignment || assignmentResponse
  const assignmentStudents = useMemo(
    () => assignmentResponse?.students || assignment?.students || [],
    [assignmentResponse, assignment],
  )
  const assignedAssessment = assignment?.assessmentId
  const assessmentIdForQuery = isEdit ? undefined : assessmentId
  const assessmentQuery = useQuery({
    queryKey: assessmentKeys.detail(assessmentIdForQuery),
    queryFn: () => getAssessment(assessmentIdForQuery),
    enabled: Boolean(assessmentIdForQuery),
  })
  const assessment = isEdit
    ? assignedAssessment
    : assessmentQuery.data?.assessment || assessmentQuery.data

  const candidatesPerPage = 8
  const candidatePageCount = Math.max(1, Math.ceil(candidateOptions.length / candidatesPerPage))
  const visibleCandidates = candidateOptions.slice((candidatePage - 1) * candidatesPerPage, candidatePage * candidatesPerPage)
  const totalDurationMinutes = (Number(durationHours || 0) * 60) + Number(durationMinutes || 0)

  useEffect(() => {
    if (!isEdit || !assignment) return
    setDurationHours(String(Math.floor(assignment.durationMinutes / 60)))
    setDurationMinutes(String(assignment.durationMinutes % 60))
    setExpiresAt(toDateTimeInput(assignment.expiresAt))
    setDescription(assignment.description || '')
    setViolationLimits({ ...defaultViolationLimits, ...assignment.violationLimits })
    setSelectedCandidates(assignmentStudents.map((student) => student.candidate || student.candidateId).filter(Boolean))
  }, [assignment, assignmentStudents, isEdit])

  useEffect(() => {
    if (fetchedCandidates.current) return
    fetchedCandidates.current = true
    setCandidateLoading(true)
    apiRequest('/admin/candidates')
      .then((response) => setCandidateOptions(normalizeCandidates(response.data)))
      .catch((error) => setSnackbar({ open: true, message: error.message, severity: 'error' }))
      .finally(() => setCandidateLoading(false))
  }, [])

  const validateConfiguration = () => {
    const nextErrors = {}
    const hours = Number(durationHours || 0)
    const minutes = Number(durationMinutes || 0)
    if (hours < 0 || !Number.isInteger(hours)) nextErrors.durationHours = 'Enter valid hours'
    if (minutes < 0 || minutes > 59 || !Number.isInteger(minutes)) nextErrors.durationMinutes = 'Enter minutes between 0 and 59'
    if ((hours * 60) + minutes < 1) nextErrors.durationMinutes = 'Enter a duration of at least 1 minute'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const goToCandidateStep = (event) => {
    event.preventDefault()
    if (validateConfiguration()) setStep(1)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!selectedCandidates.length) nextErrors.candidates = 'Select at least one candidate'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setLoading(true)
    try {
      const duration = (Number(durationHours || 0) * 60) + Number(durationMinutes || 0)
      const payload = {
        durationMinutes: duration,
        violationLimits,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        description: description || undefined,
      }
      const existingIds = new Set(assignmentStudents.map((student) => {
        const candidate = student.candidate || student.candidateId
        return candidate?._id || candidate?.id || candidate
      }))
      const response = isEdit
        ? await updateAssignment({ id: assignmentId, ...payload }).then(async (result) => {
          const newCandidates = selectedCandidates.filter((candidate) => !existingIds.has(candidate._id || candidate.id))
          if (!newCandidates.length) return { data: result }
          return assignAssessment({
            assessmentId: assignedAssessment?._id || assignedAssessment?.id || assignedAssessment,
            assignmentId,
            ...payload,
            candidateIds: newCandidates.map((candidate) => candidate._id || candidate.id),
          })
        })
        : await apiRequest(`/admin/assessments/${assessmentId}/assign`, {
          method: 'POST',
          body: JSON.stringify({ ...payload, candidateIds: selectedCandidates.map((candidate) => candidate._id) }),
        })
      const result = response.data || {}
      const skipped = result.skipped || {}
      let message = `${result.studentsAssigned || 0} candidate(s) assigned.`
      if (skipped.alreadyAssigned?.length) message += ` ${skipped.alreadyAssigned.length} were already assigned to this assessment.`
      if (skipped.invalidCandidateIds?.length) message += ` ${skipped.invalidCandidateIds.length} candidate ID(s) were invalid.`
      setSnackbar({ open: true, message, severity: 'success' })
      navigate(isEdit ? '/admin/assignments' : '/admin/assessments')
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title={isEdit ? 'Edit assignment' : 'Assign assessment'} role="Administrator">
      <Page>
        <FormHeader>
          <div>
            <h2>{assessment?.title || (isEdit ? 'Edit assignment' : 'Assign assessment')}</h2>
            <p>{isEdit ? 'Update assignment settings and add candidates.' : 'Select candidates and configure assessment access.'}</p>
          </div>
        </FormHeader>
        {(assessmentQuery.isLoading || assignmentQuery.isLoading) && <CommonLoader label={isEdit ? 'Loading assignment...' : 'Loading assessment details...'} />}
        {(assessmentQuery.isError || assignmentQuery.isError) && <Typography color="error">{(assessmentQuery.error || assignmentQuery.error).message}</Typography>}
        {assessment && (
          <Summary aria-label="Assessment summary">
            <SummaryItem><strong>Assessment</strong><span>{assessment.title}</span></SummaryItem>
            <SummaryItem><strong>Questions</strong><span>{assessment.questionIds?.length || 0}</span></SummaryItem>
            <SummaryItem><strong>Total points</strong><span>{assessment.totalPoints || 0}</span></SummaryItem>
          </Summary>
        )}
        <Stepper activeStep={step} sx={{ mb: 3 }}>
          <Step><StepLabel>Assessment settings</StepLabel></Step>
          <Step><StepLabel>Select candidates</StepLabel></Step>
        </Stepper>
        <Form onSubmit={handleSubmit}>
          {step === 0 ? (
            <Stack spacing={2}>
              <DurationGroup>
                <Typography variant="subtitle2">Test duration</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={2.5}>
                    <DropDown id="duration-hours" label="Hours" value={durationHours} onChange={(event) => setDurationHours(event.target.value)} options={hourOptions} />
                    {errors.durationHours && <Typography color="error" variant="caption">{errors.durationHours}</Typography>}
                  </Grid>
                  <Grid item xs={6} sm={2.5}>
                    <DropDown id="duration-minutes" label="Minutes" value={durationMinutes} onChange={(event) => setDurationMinutes(event.target.value)} options={minuteOptions} />
                    {errors.durationMinutes && <Typography color="error" variant="caption">{errors.durationMinutes}</Typography>}
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField type="datetime-local" label="Expires at (optional)" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} />
                  </Grid>
                </Grid>
                <Typography variant="caption" color="text.secondary">
                  Total duration: {Math.floor(totalDurationMinutes / 60)}h {totalDurationMinutes % 60}m
                </Typography>
              </DurationGroup>
              <TextField multiline rows={2} label="Description (optional)" value={description} onChange={(event) => setDescription(event.target.value)} />
              <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>Violation limits (optional - defaults shown)</Typography></AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {Object.keys(defaultViolationLimits).map((key) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <TextField type="number" label={violationLabels[key]} value={violationLimits[key]} onChange={(event) => setViolationLimits((current) => ({ ...current, [key]: Number(event.target.value) }))} min={0} />
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Stack>
          ) : (
            <Stack spacing={2}>
              {candidateLoading && <CommonLoader label="Loading candidates..." />}
              <div>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Candidates</Typography>
                <Stack sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 1 }}>
                  {visibleCandidates.map((candidate) => (
                    <FormControlLabel
                      key={candidate._id}
                      control={(
                        <Checkbox
                          checked={selectedCandidates.some((selected) => selected._id === candidate._id)}
                          onChange={(event) => {
                            const nextCandidates = event.target.checked
                              ? [...selectedCandidates, candidate]
                              : selectedCandidates.filter((selected) => selected._id !== candidate._id)
                            setSelectedCandidates(nextCandidates)
                            if (nextCandidates.length) {
                              setErrors((current) => ({ ...current, candidates: undefined }))
                            }
                          }}
                        />
                      )}
                      label={`${candidate.firstName || ''} ${candidate.lastName || ''} (${candidate.email || 'No email'})`}
                    />
                  ))}
                  {!candidateLoading && !visibleCandidates.length && <Typography sx={{ p: 2 }} color="text.secondary">No candidates available.</Typography>}
                </Stack>
                {errors.candidates && <Typography color="error" variant="caption">{errors.candidates}</Typography>}
                {candidatePageCount > 1 && (
                  <Pagination
                    count={candidatePageCount}
                    page={candidatePage}
                    onChange={(_, nextPage) => setCandidatePage(nextPage)}
                    sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                  />
                )}
                <Typography variant="caption" color="text.secondary">
                  {selectedCandidates.length} candidate{selectedCandidates.length === 1 ? '' : 's'} selected
                </Typography>
              </div>
            </Stack>
          )}
          <Actions>
            <Button type="button" variant="secondary" disabled={loading} onClick={() => navigate(isEdit ? '/admin/assignments' : '/admin/assessments')}>Cancel</Button>
            {step === 1 && <Button type="button" variant="secondary" disabled={loading} onClick={() => setStep(0)}>Back</Button>}
            {step === 0 ? (
              <Button type="button" disabled={loading} onClick={goToCandidateStep}>Next: select candidates</Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading && <CircularProgress size={20} sx={{ mr: 1, color: 'inherit' }} />}
                {isEdit ? 'Save changes' : 'Assign assessment'}
              </Button>
            )}
          </Actions>
        </Form>
      </Page>
      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar((current) => ({ ...current, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((current) => ({ ...current, open: false }))} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </DashboardLayout>
  )
}
