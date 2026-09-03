import { useEffect, useState } from 'react'
import {
  Actions,
  Form,
  FormGrid,
  FormPage,
  FormHeader,
  OptionRow,
  CheckboxLabel,
  ValidationMessage,
} from './styles'
import { Button } from '../ui/Button'
import { DropDown } from '../ui/DropDown'
import { NumberField } from '../ui/NumberField'
import { TextField } from '../ui/TextField'

const emptyQuestion = {
  title: '',
  type: 'Single choice',
  difficulty: 'Easy',
  status: 'Draft',
  points: 1,
  additionalInfo: {
    options: ['', ''],
    correctAnswers: [],
    expectedAnswer: '',
  },
}

/* eslint-disable react/prop-types */
export function QuestionForm({ question, onCancel, onSave }) {
  const [values, setValues] = useState({
    ...emptyQuestion,
    ...question,
    additionalInfo: { ...emptyQuestion.additionalInfo, ...question?.additionalInfo },
  })
  const [validationError, setValidationError] = useState('')
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
        options: type === 'Short answer'
          ? []
          : (current.additionalInfo.options?.length ? current.additionalInfo.options : ['', '']),
        correctAnswers: type === 'Short answer' ? [] : current.additionalInfo.correctAnswers || [],
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
      const correctAnswers = current.type === 'Single choice'
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
    if (values.type !== 'Short answer' && (!values.additionalInfo.options.length || !values.additionalInfo.correctAnswers.length)) {
      setValidationError('Select at least one correct answer before saving.')
      return
    }
    setValidationError('')
    onSave({ ...values, id: question?.id })
  }

  return (
    <FormPage>
      <FormHeader>
        <h2 id="question-form-title">{isEditing ? 'Edit question' : 'Add question'}</h2>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </FormHeader>
        <Form onSubmit={handleSubmit}>
          <TextField id="question-title" label="Question" name="title" value={values.title} onChange={updateValue} required multiline rows="4" />
          <FormGrid>
            <DropDown id="question-type" label="Type" name="type" value={values.type} onChange={changeType} options={['Single choice', 'Multiple choice', 'Short answer'].map((value) => ({ value, label: value }))} />
            <DropDown id="question-difficulty" label="Difficulty" name="difficulty" value={values.difficulty} onChange={updateValue} options={['Easy', 'Medium', 'Hard'].map((value) => ({ value, label: value }))} />
            <NumberField id="question-points" label="Points" name="points" min="0" step="0.5" value={values.points} onChange={updateValue} required />
            {values.type === 'Short answer' ? (
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
                <p>Answer options and scoring</p>
                {values.additionalInfo.options.map((option, index) => (
                  <OptionRow key={index}>
                    <CheckboxLabel>
                      <input
                        type={values.type === 'Single choice' ? 'radio' : 'checkbox'}
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
          <DropDown id="question-status" label="Status" name="status" value={values.status} onChange={updateValue} options={['Draft', 'Published'].map((value) => ({ value, label: value }))} />
          <Actions>
            <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button type="submit">{isEditing ? 'Save changes' : 'Add question'}</Button>
          </Actions>
        </Form>
    </FormPage>
  )
}
