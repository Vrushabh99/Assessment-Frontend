import { useEffect, useState } from 'react'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import IconButton from '@mui/material/IconButton'
import {
  Actions,
  Form,
  FormGrid,
  FormPage,
  FormHeader,
  OptionRow,
  CheckboxLabel,
  SectionHeader,
  SectionActions,
  ValidationMessage,
} from './styles'
import { Button } from '../ui/Button'
import { DropDown } from '../ui/DropDown'
import { NumberField } from '../ui/NumberField'
import { TextField } from '../ui/TextField'
import { QuestionRenderer } from '../QuestionRenderer'
import { QUESTION_RENDERER_MODES } from '../QuestionRenderer/constants'

const emptyQuestion = {
  questionText: '',
  type: 'single-choice',
  difficulty: 'easy',
  status: 'draft',
  points: 1,
  additionalInfo: {
    options: ['', ''],
    correctAnswers: [],
    expectedAnswer: '',
  },
}

const typeOptions = [
  { value: 'single-choice', label: 'Single choice' },
  { value: 'multiple-choice', label: 'Multiple choice' },
  { value: 'short-answer', label: 'Short answer' },
]
const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]
const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
]

/* eslint-disable react/prop-types */
export function QuestionForm({ question, onCancel, onSave, isSaving = false, saveError = '' }) {
  const [values, setValues] = useState({
    ...emptyQuestion,
    ...question,
    additionalInfo: { ...emptyQuestion.additionalInfo, ...question?.additionalInfo },
  })
  const [validationError, setValidationError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const isEditing = Boolean(question)

  useEffect(() => {
    setValues({
      ...emptyQuestion,
      ...question,
      additionalInfo: { ...emptyQuestion.additionalInfo, ...question?.additionalInfo },
    })
  }, [question])

  const updateValue = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  const changeType = (event) => {
    const type = event.target.value
    setValues((current) => ({
      ...current,
      type,
      additionalInfo: {
        ...current.additionalInfo,
        options: type === 'short-answer'
          ? []
          : (current.additionalInfo.options?.length ? current.additionalInfo.options : ['', '']),
        correctAnswers: type === 'short-answer' ? [] : current.additionalInfo.correctAnswers || [],
      },
    }))
  }

  const updateOption = (index, value) => {
    setValues((current) => ({
      ...current,
      additionalInfo: {
        ...current.additionalInfo,
        options: current.additionalInfo.options.map((option, optionIndex) => optionIndex === index ? value : option),
      },
    }))
  }

  const toggleCorrectAnswer = (index) => {
    setValues((current) => {
      const currentAnswers = current.additionalInfo.correctAnswers || []
      const isSelected = currentAnswers.includes(index)
      const correctAnswers = current.type === 'single-choice'
        ? (isSelected ? [] : [index])
        : (isSelected ? currentAnswers.filter((answer) => answer !== index) : [...currentAnswers, index])
      return { ...current, additionalInfo: { ...current.additionalInfo, correctAnswers } }
    })
  }

  const addOption = () => setValues((current) => ({
    ...current,
    additionalInfo: { ...current.additionalInfo, options: [...current.additionalInfo.options, ''] },
  }))
  const removeOption = (index) => setValues((current) => ({
    ...current,
    additionalInfo: {
      ...current.additionalInfo,
      options: current.additionalInfo.options.filter((_, optionIndex) => optionIndex !== index),
      correctAnswers: (current.additionalInfo.correctAnswers || [])
        .filter((answer) => answer !== index)
        .map((answer) => answer > index ? answer - 1 : answer),
    },
  }))

  const handleSubmit = (event) => {
    event.preventDefault()
    if (values.type !== 'short-answer' && (!values.additionalInfo.options.length || !values.additionalInfo.correctAnswers.length)) {
      setValidationError('Select at least one correct answer before saving.')
      return
    }
    setValidationError('')
    Promise.resolve(onSave({ ...values, id: question?.id })).catch((error) => setValidationError(error.message))
  }

  return (
    <FormPage>
      <FormHeader>
        <h2 id="question-form-title">{isEditing ? 'Edit question' : 'Add question'}</h2>
        <Actions>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        </Actions>
      </FormHeader>
      <Form onSubmit={handleSubmit}>
          <TextField id="question-title" label="Question" name="questionText" value={values.questionText} onChange={updateValue} required multiline rows="4" />
          <FormGrid>
            <DropDown id="question-type" label="Type" name="type" value={values.type} onChange={changeType} options={typeOptions} />
            <DropDown id="question-difficulty" label="Difficulty" name="difficulty" value={values.difficulty} onChange={updateValue} options={difficultyOptions} />
            <NumberField id="question-points" label="Points" name="points" min="0" step="0.5" value={values.points} onChange={updateValue} required />
            {values.type === 'short-answer' ? (
              <TextField
                  id="expected-answer"
                  label="Expected answer"
                  name="expectedAnswer"
                  value={values.additionalInfo.expectedAnswer}
                  onChange={(event) => setValues((current) => ({
                    ...current,
                    additionalInfo: { ...current.additionalInfo, expectedAnswer: event.target.value },
                  }))}
                  required
                  rows="3"
                  multiline
                />
            ) : (
              <div>
                <SectionHeader>
                  <strong>Answer options and scoring</strong>
                  <SectionActions>
                    <IconButton
                      type="button"
                      aria-label={showPreview ? 'Edit question' : 'Preview question'}
                      title={showPreview ? 'Edit question' : 'Preview question'}
                      onClick={() => setShowPreview((current) => !current)}
                    >
                      {showPreview ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </SectionActions>
                </SectionHeader>
                {values.additionalInfo.options.map((option, index) => (
                  <OptionRow key={index}>
                    <CheckboxLabel>
                      <input
                        type={values.type === 'single-choice' ? 'radio' : 'checkbox'}
                        name="correct-answer"
                        checked={(values.additionalInfo.correctAnswers || []).includes(index)}
                        onChange={() => toggleCorrectAnswer(index)}
                      />
                      Correct
                    </CheckboxLabel>
                    <TextField value={option} onChange={(event) => updateOption(index, event.target.value)} placeholder={`Option ${index + 1}`} required />
                    {values.additionalInfo.options.length > 2 && <Button type="button" variant="secondary" onClick={() => removeOption(index)}>Remove</Button>}
                  </OptionRow>
                ))}
                <Button type="button" variant="secondary" onClick={addOption}>+ Add option</Button>
              </div>
            )}
            {validationError && <ValidationMessage role="alert">{validationError}</ValidationMessage>}
          </FormGrid>
          {showPreview && (
            <QuestionRenderer
              key={values.type}
              question={values}
              mode={QUESTION_RENDERER_MODES.PREVIEW}
            />
          )}
          <DropDown id="question-status" label="Status" name="status" value={values.status} onChange={updateValue} options={statusOptions} />
          <Actions>
            <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
            {(validationError || saveError) && <ValidationMessage role="alert">{validationError || saveError}</ValidationMessage>}
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : (isEditing ? 'Save changes' : 'Add question')}</Button>
          </Actions>
        </Form>
    </FormPage>
  )
}
