import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Actions,
  Form,
  FormGrid,
  Grid,
  FormPage,
  FormHeader,
  OptionRow,
  CheckboxLabel,
  SectionHeader,
  ValidationMessage,
  FormHeaderContent,
  CorrectIcon,
  OptionIconWrapper,
} from './styles'
import { Button } from '../ui/Button'
import { DropDown } from '../ui/DropDown'
import { NumberField } from '../ui/NumberField'
import { TextField } from '../ui/TextField'
import { QuestionRenderer } from '../QuestionRenderer'
import { QUESTION_RENDERER_MODES } from '../QuestionRenderer/constants'
import { Radio } from '../ui/Radio'
import { CheckBox } from '../ui/CheckBox'

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
  { value: 'single-choice', label: 'Single Choice' },
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'short-answer', label: 'Short Answer' },
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
        <FormHeaderContent>
        <h2 id="question-form-title">{isEditing ? 'Edit question' : 'Add question'}</h2>
        <Actions>
          <Button type="button" variant="primary" onClick={() => setShowPreview((current) => !current)}>
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSaving}>{isSaving ? 'Saving...' : (isEditing ? 'Save changes' : 'Add question')}</Button>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        </Actions>
        </FormHeaderContent>
        {(validationError || saveError) && <ValidationMessage role="alert">{validationError || saveError}</ValidationMessage>}
      </FormHeader>
      <Form>
          {showPreview ? (
            <QuestionRenderer
              key={values.type}
              question={values}
              mode={QUESTION_RENDERER_MODES.PREVIEW}
            />
          ): (
          <>
          <DropDown
            id="question-status"
            label="Status"
            name="status"
            value={values.status}
            onChange={updateValue}
            options={statusOptions}
            style={{width: 200}}
          />
          <TextField id="question-title" label="Question" name="questionText" value={values.questionText} onChange={updateValue} required multiline rows="4" />
          <FormGrid>
            <Grid>
            <DropDown id="question-type" label="Type" name="type" value={values.type} onChange={changeType} options={typeOptions} style={{ width: 180 }}/>
            <DropDown id="question-difficulty" label="Difficulty" name="difficulty" value={values.difficulty} onChange={updateValue} options={difficultyOptions} />
             <NumberField id="question-points" label="Points" name="points" min="1" max="10" value={values.points} onChange={updateValue} required style={{ width: 80 }}/>
            </Grid>
            <Grid>
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
              <>
                <SectionHeader>
                  <strong>Answer options and scoring</strong>
                 
                </SectionHeader>
                {values.additionalInfo.options.map((option, index) => (
                  <OptionRow key={index}>
                    <OptionIconWrapper>
                    {(values.additionalInfo.correctAnswers || []).includes(index) && (
                      <CorrectIcon />
                    )}
                    </OptionIconWrapper>
                    <CheckboxLabel>
                      {values.type === 'single-choice' ? (
                        <Radio
                          checked={(values.additionalInfo.correctAnswers || []).includes(index)}
                          onChange={() => toggleCorrectAnswer(index)}
                        />
                      ): (
                        <CheckBox
                          checked={(values.additionalInfo.correctAnswers || []).includes(index)}
                          onChange={() => toggleCorrectAnswer(index)}
                        />
                      )}
                    </CheckboxLabel>
                    <TextField value={option} onChange={(event) => updateOption(index, event.target.value)} placeholder={`Option ${index + 1}`} required multiline maxRows="3" />
                    {values.additionalInfo.options.length > 2 && <Button type="button" variant="icon" title="Delete Option" onClick={() => removeOption(index)}><DeleteIcon /></Button>}
                  </OptionRow>
                ))}
                <Button type="button" variant="primary" onClick={addOption}>+ Add Option</Button>
                </>
            )}
            </Grid>
          </FormGrid>
          </>
        )}
        </Form>
    </FormPage>
  )
}
