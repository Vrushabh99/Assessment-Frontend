import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components'
import {
  candidateAssessmentKeys,
  logViolation,
  saveAnswer,
  startAndGetAttemptState,
  submitAttempt,
} from '../../../api/attempts'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { CommonLoader } from '../../../components/ui/CommonLoader'
import { Pill } from '../../../components/ui/Pill'
import { Button } from '../../../components/ui/Button'
import { QuestionRenderer } from '../../../components/QuestionRenderer'
import { QUESTION_RENDERER_MODES } from '../../../components/QuestionRenderer/constants'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

const Layout = styled.div`display: grid; gap: 16px;`
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 32px ${({ theme }) => theme.colors.shadow};
  flex-wrap: wrap;
`
const TitleBlock = styled.div``
const Title = styled.h2`margin: 0;`
const ActionWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
`;
const TimerDisplay = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ $warning, theme }) => ($warning ? '#b54708' : theme.colors.text)};
`
const QuestionList = styled.div`display: grid; gap: 16px;`
const SaveState = styled.span`font-size: 0.8rem; color: ${({ theme }) => theme.colors.muted};`
const Actions = styled.div`display: flex; justify-content: flex-end; gap: 12px; align-items: center;`
const ErrorState = styled.p`color: #b42318;`

const formatSeconds = (totalSeconds) => {
  const clamped = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(clamped / 60)
  const seconds = clamped % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const toApiAnswer = (question, answer) => {
  if (question.type === 'short-answer') return { textAnswer: answer ?? '' }
  const options = Array.isArray(answer) ? answer : answer === undefined || answer === '' ? [] : [answer]
  return { selectedOptionIds: options }
}

const fromApiAnswer = (question, savedAnswer) => {
  if (!savedAnswer) return undefined
  if (question.type === 'short-answer') return savedAnswer.textAnswer
  if (question.type === 'single-choice') return savedAnswer.selectedOptionIds?.[0]
  return savedAnswer.selectedOptionIds || []
}

export function AttemptTakingPage() {
  const { assessmentId, assignmentId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const stateKey = candidateAssessmentKeys.detail(assessmentId, assignmentId)
  const [answers, setAnswers] = useState({})
  const [remainingMs, setRemainingMs] = useState(null)
  const [savingIds, setSavingIds] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const hasSubmittedRef = useRef(false)
  const timerRef = useRef(null)

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const stateQuery = useQuery({
    queryKey: candidateAssessmentKeys.attempt(assessmentId, assignmentId),
    queryFn: () => startAndGetAttemptState({ assessmentId, assignmentId }),
  })

  useEffect(() => {
    stateQuery.refetch()
    // Request fullscreen when attempt starts
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request denied:', err)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId, assignmentId])

  useEffect(() => {
    if (!stateQuery.data) return
    const nextAnswers = {}
    stateQuery.data.assessment.questions.forEach((question) => {
      const savedAnswer = stateQuery.data.answers.find((answer) => answer.questionId === question._id)
      nextAnswers[question._id] = fromApiAnswer(question, savedAnswer)
    })
    setAnswers(nextAnswers)
  }, [stateQuery.data])

  const submitMutation = useMutation({
    mutationFn: () => submitAttempt({ assessmentId, assignmentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stateKey })
      navigate(`/candidate/assessments/${assessmentId}/assignments/${assignmentId}`)
    },
    onError: (error) => setSubmitError(error.message),
  })

  const handleSubmit = useCallback(() => {
    if (hasSubmittedRef.current) return
    hasSubmittedRef.current = true
    submitMutation.mutate()
  }, [submitMutation])

  const handleSubmitRef = useRef(handleSubmit)
  useEffect(() => {
    handleSubmitRef.current = handleSubmit
  }, [handleSubmit])

  const expiresAt = stateQuery.data?.expiresAt
  const serverTime = stateQuery.data?.serverTime
  const isSubmittedStatus = stateQuery.data?.status === 'submitted'

  useEffect(() => {
    if (!expiresAt || !serverTime || isSubmittedStatus) {
      if (timerRef.current) clearInterval(timerRef.current)
      return undefined
    }

    const initialServerMs = new Date(serverTime).getTime()
    const expiresMs = new Date(expiresAt).getTime()
    const startTime = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startTime
      const remaining = expiresMs - (initialServerMs + elapsed)
      setRemainingMs(Math.max(0, remaining))

      if (remaining <= 0) {
        handleSubmitRef.current()
      }
    }

    // Set immediately
    tick()

    // Update every second
    timerRef.current = setInterval(tick, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [expiresAt, serverTime, isSubmittedStatus])

  const saveAnswerMutation = useMutation({
    mutationFn: ({ question, answer }) => saveAnswer({ assessmentId, assignmentId, questionId: question._id, ...toApiAnswer(question, answer) }),
  })

  const debounceTimers = useRef({})
  useEffect(() => {
    const timers = debounceTimers.current
    return () => {
      Object.values(timers).forEach((timerId) => clearTimeout(timerId))
    }
  }, [])
  const handleAnswer = (question, answer) => {
    setAnswers((current) => ({ ...current, [question._id]: answer }))
    setSavingIds((current) => ({ ...current, [question._id]: 'pending' }))
    if (debounceTimers.current[question._id]) clearTimeout(debounceTimers.current[question._id])
    debounceTimers.current[question._id] = setTimeout(() => {
      saveAnswerMutation.mutate(
        { question, answer },
        {
          onSuccess: () => setSavingIds((current) => ({ ...current, [question._id]: 'saved' })),
          onError: () => setSavingIds((current) => ({ ...current, [question._id]: 'error' })),
        }
      )
    }, 600)
  }

  const logViolationMutation = useMutation({
    mutationFn: (type) => logViolation({ assessmentId, assignmentId, type }),
    onSuccess: (data) => {
      if (data.autoSubmitted) {
        hasSubmittedRef.current = true
        queryClient.invalidateQueries({ queryKey: stateKey })
        navigate(`/candidate/assessments/${assessmentId}/assignments/${assignmentId}`)
      }
    },
  })

  const reportViolation = useCallback(
    (type) => {
      if (hasSubmittedRef.current || stateQuery.data?.status === 'submitted') return
      logViolationMutation.mutate(type)
    },
    [logViolationMutation, stateQuery.data?.status]
  )

  useEffect(() => {
    if (!stateQuery.data || stateQuery.data.status === 'submitted') return undefined

    const onVisibilityChange = () => {
      if (document.hidden) reportViolation('tab_switch')
    }
    const onBlur = () => reportViolation('window_blur')
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) reportViolation('fullscreen_exit')
    }
    const onCopy = (event) => {
      event.preventDefault()
      reportViolation('copy')
    }
    const onPaste = (event) => {
      event.preventDefault()
      reportViolation('paste')
    }
    const onContextMenu = (event) => {
      event.preventDefault()
      reportViolation('right_click')
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('blur', onBlur)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('copy', onCopy)
    document.addEventListener('paste', onPaste)
    document.addEventListener('contextmenu', onContextMenu)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.removeEventListener('copy', onCopy)
      document.removeEventListener('paste', onPaste)
      document.removeEventListener('contextmenu', onContextMenu)
    }
  }, [stateQuery.data, reportViolation])

  const isWarning = remainingMs !== null && remainingMs <= 5 * 60 * 1000
  const isSubmitted = stateQuery.data?.status === 'submitted'

  const violationSummary = useMemo(() => {
    if (!stateQuery.data) return []
    const counts = stateQuery.data.violationCounts || {}
    const limits = stateQuery.data.violationLimits || {}
    return Object.keys(counts)
      .filter((key) => counts[key] > 0)
      .map((key) => `${key.replace('_', ' ')}: ${counts[key]}${limits[key] !== undefined ? `/${limits[key]}` : ''}`)
  }, [stateQuery.data])

  return (
    <DashboardLayout title="Assessment attempt" role="Candidate" hideNavigation>
      {stateQuery.isLoading && <CommonLoader label="Loading assessment..." />}
      {stateQuery.isError && <ErrorState role="alert">{stateQuery.error.message}</ErrorState>}
      {submitError && <ErrorState role="alert">{submitError}</ErrorState>}
      {stateQuery.data && (
        <Layout>
          <Header>
            <TitleBlock>
              <Title>{stateQuery.data.assessment.title}</Title>
              {violationSummary.length > 0 && (
                <SaveState>Proctoring: {violationSummary.join(', ')}</SaveState>
              )}
            </TitleBlock>
            <ActionWrapper>
              {!isSubmitted && remainingMs !== null && (
                <TimerDisplay $warning={isWarning} aria-label="Time remaining">
                  <HourglassBottomIcon />
                  {formatSeconds(remainingMs / 1000)}
                </TimerDisplay>
              )}
            {!isSubmitted && (
            <Actions>
              {submitMutation.isPending && <SaveState>Submitting...</SaveState>}
              <Button type="button" onClick={handleSubmit} disabled={submitMutation.isPending}>
                Submit
              </Button>
            </Actions>
          )}
            {isSubmitted && <Pill tone="success">Submitted</Pill>}
            </ActionWrapper>
          </Header>

          <QuestionList>
            {stateQuery.data.assessment.questions.map((question) => (
              <div key={question._id}>
                <QuestionRenderer
                  question={question}
                  mode={isSubmitted ? QUESTION_RENDERER_MODES.PREVIEW : QUESTION_RENDERER_MODES.ATTEMPT}
                  answer={answers[question._id]}
                  onAnswer={(answer) => handleAnswer(question, answer)}
                />
                {!isSubmitted && savingIds[question._id] && (
                  <SaveState>
                    {savingIds[question._id] === 'pending' && 'Saving...'}
                    {savingIds[question._id] === 'saved' && 'Saved'}
                    {savingIds[question._id] === 'error' && 'Failed to save'}
                  </SaveState>
                )}
              </div>
            ))}
          </QuestionList>
        </Layout>
      )}
    </DashboardLayout>
  )
}
