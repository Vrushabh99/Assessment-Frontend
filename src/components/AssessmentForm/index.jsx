import { useEffect, useState } from 'react'
import DeleteOutlineIcon from '@mui/icons-material/Delete'
import { Pill } from '../ui/Pill'
import { Button } from '../ui/Button'
import { DropDown } from '../ui/DropDown'
import { TextField } from '../ui/TextField'
import { CommonLoader } from '../ui/CommonLoader'
import { DeleteButton, EmptyState, Form, FormHeader, FormPage, Pagination, QuestionList, QuestionOption, QuestionText, SelectedCount, SelectedQuestion, SelectedQuestions, SelectedQuestionsHeader, Actions, ValidationMessage, QuestionMeta, HeaderActions } from './styles'

const formatQuestionType = (type) => type.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
const getQuestionId = (question) => typeof question === 'string' ? question : question.id || question._id
const normalizeSelectedQuestion = (question) => ({
  ...question,
  id: getQuestionId(question),
  questionText: question.questionText || question.title || '',
})

/* eslint-disable react/prop-types */
export function AssessmentForm({ questions, initialAssessment, isLoading, loadError, onCancel, onSave, search, onSearch, page, totalPages, onPageChange, isSaving = false, saveError = '' }) {
  const initialQuestions = (initialAssessment?.questionIds || []).map(normalizeSelectedQuestion)
  const [title, setTitle] = useState(initialAssessment?.title || '')
  const [status, setStatus] = useState(initialAssessment?.status || 'draft')
  const [selectedIds, setSelectedIds] = useState(initialQuestions.map((question) => question._id || question.id || question))
  const [selectedQuestions, setSelectedQuestions] = useState(initialQuestions)
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    if (!initialAssessment) return
    const normalizedQuestions = initialAssessment.questionIds.map(normalizeSelectedQuestion)
    const initialQuestionIds = normalizedQuestions.map(getQuestionId)
    setTitle(initialAssessment.title)
    setStatus(initialAssessment.status)
    setSelectedIds(initialQuestionIds)
    setSelectedQuestions(normalizedQuestions)
  }, [initialAssessment])

  const toggleQuestion = (id) => {
    const question = questions.find((item) => getQuestionId(item) === id)
    setSelectedIds((current) => current.includes(id)
      ? current.filter((selectedId) => selectedId !== id)
      : [...current, id])
    setSelectedQuestions((current) => current.some((item) => getQuestionId(item) === id)
      ? current.filter((item) => getQuestionId(item) !== id)
      : question ? [...current, normalizeSelectedQuestion(question)] : current)
  }

  const removeSelectedQuestion = (id) => {
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id))
    setSelectedQuestions((current) => current.filter((question) => getQuestionId(question) !== id))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!title.trim()) return setValidationError('Enter an assessment title.')
    if (!selectedIds.length) return setValidationError('Select at least one question.')
    setValidationError('')
    try {
      await onSave({ title: title.trim(), questionIds: selectedIds, status })
    } catch (error) {
      setValidationError(error.message)
    }
  }

  return (
    <FormPage>
      <FormHeader>
        <div>
          <h2>{initialAssessment ? 'Edit assessment' : 'Create assessment'}</h2>
          <p>Add a title and choose the questions candidates will answer.</p>
        </div>
        <HeaderActions>
          <DropDown
            id="assessment-status"
            aria-label="Assessment status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
              { value: 'archived', label: 'Archived' },
            ]}
          />
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        </HeaderActions>
      </FormHeader>
      <Form onSubmit={handleSubmit}>
        <TextField id="assessment-title" label="Assessment title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <div>
          <SelectedCount>
            {selectedIds.length} question{selectedIds.length === 1 ? '' : 's'} selected
            <span>Total assessment points: {selectedQuestions.reduce((total, question) => total + Number(question.points || 0), 0)}</span>
          </SelectedCount>
          {selectedQuestions.length > 0 && (
            <SelectedQuestions>
              <SelectedQuestionsHeader>Selected questions</SelectedQuestionsHeader>
              {selectedQuestions.map((question, index) => (
                <SelectedQuestion key={getQuestionId(question)}>
                  <QuestionText>
                    <QuestionMeta>
                      <strong>{index + 1}. QP-{question.qp_number}</strong>
                      <Pill tone="info">{formatQuestionType(question.type)}</Pill>
                      <Pill tone="neutral">{question.points} point{question.points === 1 ? '' : 's'}</Pill>
                    </QuestionMeta>
                    <span>{question.questionText}</span>
                  </QuestionText>
                  <DeleteButton type="button" aria-label={`Remove QP-${question.qp_number}`} title="Remove question" onClick={() => removeSelectedQuestion(question.id)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </DeleteButton>
                </SelectedQuestion>
              ))}
            </SelectedQuestions>
          )}
          <TextField id="question-search" aria-label="Search questions" placeholder="Search questions" value={search} onChange={(event) => onSearch(event.target.value)} />
          {isLoading && <CommonLoader label="Loading questions..." />}
          {loadError && <ValidationMessage role="alert">{loadError}</ValidationMessage>}
          {!isLoading && !loadError && !questions.length && <EmptyState>No questions match your search.</EmptyState>}
          <QuestionList>
            {questions.map((question) => (
              <QuestionOption key={question.id} $selected={selectedIds.includes(question.id)}>
                <input type="checkbox" checked={selectedIds.includes(question.id)} onChange={() => toggleQuestion(question.id)} />
                <QuestionText>
                  <QuestionMeta>
                    <strong>QP-{question.qp_number}</strong>
                    <Pill tone="info">{formatQuestionType(question.type)}</Pill>
                    <Pill tone="neutral">{question.points} point{question.points === 1 ? '' : 's'}</Pill>
                  </QuestionMeta>
                  <span>{question.questionText}</span>
                </QuestionText>
              </QuestionOption>
            ))}
          </QuestionList>
          {totalPages > 1 && (
            <Pagination>
              <Button type="button" variant="secondary" disabled={page === 1} onClick={() => onPageChange(page - 1)}>Previous</Button>
              <span>Page {page} of {totalPages}</span>
              <Button type="button" variant="secondary" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next</Button>
            </Pagination>
          )}
        </div>
        {validationError && <ValidationMessage role="alert">{validationError}</ValidationMessage>}
        {saveError && <ValidationMessage role="alert">{saveError}</ValidationMessage>}
        <Actions>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : (initialAssessment ? 'Save changes' : 'Create assessment')}</Button>
        </Actions>
      </Form>
    </FormPage>
  )
}
