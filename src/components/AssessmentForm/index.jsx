import { useState } from 'react'
import { Button } from '../ui/Button'
import { TextField } from '../ui/TextField'
import { CommonLoader } from '../ui/CommonLoader'
import { EmptyState, Form, FormHeader, FormPage, Pagination, QuestionList, QuestionOption, QuestionText, SelectedCount, Actions, ValidationMessage } from './styles'

/* eslint-disable react/prop-types */
export function AssessmentForm({ questions, isLoading, loadError, onCancel, onSave, search, onSearch, page, totalPages, onPageChange }) {
  const [title, setTitle] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [validationError, setValidationError] = useState('')

  const toggleQuestion = (id) => {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((selectedId) => selectedId !== id)
      : [...current, id])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!title.trim()) return setValidationError('Enter an assessment title.')
    if (!selectedIds.length) return setValidationError('Select at least one question.')
    setValidationError('')
    await onSave({ title: title.trim(), questionIds: selectedIds })
  }

  return (
    <FormPage>
      <FormHeader>
        <div>
          <h2>Create assessment</h2>
          <p>Add a title and choose the questions candidates will answer.</p>
        </div>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </FormHeader>
      <Form onSubmit={handleSubmit}>
        <TextField id="assessment-title" label="Assessment title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <div>
          <SelectedCount>{selectedIds.length} question{selectedIds.length === 1 ? '' : 's'} selected</SelectedCount>
          <TextField id="question-search" aria-label="Search questions" placeholder="Search questions" value={search} onChange={(event) => onSearch(event.target.value)} />
          {isLoading && <CommonLoader label="Loading questions..." />}
          {loadError && <ValidationMessage role="alert">{loadError}</ValidationMessage>}
          {!isLoading && !loadError && !questions.length && <EmptyState>No questions match your search.</EmptyState>}
          <QuestionList>
            {questions.map((question) => (
              <QuestionOption key={question.id} $selected={selectedIds.includes(question.id)}>
                <input type="checkbox" checked={selectedIds.includes(question.id)} onChange={() => toggleQuestion(question.id)} />
                <QuestionText>
                  <strong>QP-{question.qp_number}</strong>
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
        <Actions>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Create assessment</Button>
        </Actions>
      </Form>
    </FormPage>
  )
}
