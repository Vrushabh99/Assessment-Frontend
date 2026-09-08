import { useEffect, useState } from 'react'
import { Pill } from '../ui/Pill'
import { CheckCircle, Cancel } from '@mui/icons-material';
import { AnswerInput, CorrectIncorrectWrapper, Feedback, green, Option, OptionText, Options, OptionWrapper, QuestionCard, QuestionHeader, QuestionMeta, QuestionTitle, red, ScoreField } from './styles'
import { QUESTION_RENDERER_MODES } from './constants'
import { CheckBox } from '../ui/CheckBox';
import { Radio } from '../ui/Radio';

const getInfo = (question) => question.additionalInfo || {}
const getOptions = (question) => getInfo(question).options || []
const getCorrectAnswers = (question) => getInfo(question).correctAnswers || []
const isTeacherMode = (mode) => mode === QUESTION_RENDERER_MODES.TEACHER
const isReadOnly = (mode) => isTeacherMode(mode)
const isPreview = (mode) => mode === QUESTION_RENDERER_MODES.PREVIEW

function isSelected(answer, index) {
  return Array.isArray(answer) ? answer.includes(index) : answer === index
}

function getAnswerLabel(question, answer) {
  if (question.type === 'short-answer') return answer || 'No answer'
  const options = getOptions(question)
  const indexes = Array.isArray(answer) ? answer : [answer]
  return indexes.filter((index) => Number.isInteger(index) && options[index]).map((index) => options[index]).join(', ') || 'No answer'
}

function checkIsCorrect(question, answer, correctAnswers) {
  if (question.type === 'short-answer') {
    return String(answer || '').trim().toLowerCase() === String(getInfo(question).expectedAnswer || '').trim().toLowerCase()
  }
  return JSON.stringify([...(Array.isArray(answer) ? answer : [answer])].sort()) === JSON.stringify([...correctAnswers].sort())
}

/* eslint-disable react/prop-types */
export function QuestionRenderer({
  question,
  mode = QUESTION_RENDERER_MODES.ATTEMPT,
  answer,
  onAnswer,
  score,
  onScore,
  showCorrectAnswer = false,
}) {

  console.log(
    question,
  mode,
  answer,
  onAnswer,
  score,
  onScore,
  showCorrectAnswer);

  const [localAnswer, setLocalAnswer] = useState(answer ?? (question.type === 'multiple-choice' ? [] : ''))
  const currentAnswer = answer === undefined ? localAnswer : answer
  const teacherMode = isTeacherMode(mode)
  const readOnly = isReadOnly(mode)
  const preview = isPreview(mode)
  const correctAnswers = getCorrectAnswers(question)

  // Reveal correctness either in teacher mode (grading), or whenever the
  // caller explicitly asks for it (e.g. a post-submission review screen).
  const revealCorrect = teacherMode || showCorrectAnswer

  useEffect(() => {
    if (answer !== undefined) setLocalAnswer(answer)
  }, [answer])

  const updateAnswer = (nextAnswer) => {
    if (readOnly) return
    setLocalAnswer(nextAnswer)
    if (preview) return
    onAnswer?.(nextAnswer)
  }

  const toggleOption = (index) => {
    if (question.type === 'single-choice') {
      updateAnswer(index)
      return
    }
    const selected = Array.isArray(currentAnswer) ? currentAnswer : []
    updateAnswer(selected.includes(index) ? selected.filter((item) => item !== index) : [...selected, index])
  }

  const optionIsCorrect = (index) => correctAnswers.includes(index)
  const optionIsSelected = (index) => isSelected(currentAnswer, index)
  const teacherAnswer = teacherMode ? answer : undefined
  // Whichever answer is relevant to the current mode: the teacher-view
  // answer being graded, or the candidate's own current answer.
  const answerToEvaluate = teacherMode ? teacherAnswer : currentAnswer
  const answerIsCorrect = checkIsCorrect(question, answerToEvaluate, correctAnswers)

  return (
    <QuestionCard>
      <QuestionHeader>
        <QuestionTitle>{question.questionText}</QuestionTitle>
        <QuestionMeta>
          {revealCorrect &&  question.type !== 'short-answer' && (
            <Pill tone={answerIsCorrect ? 'success' : 'warning'}>
              {answerIsCorrect ? 'Correct' : 'Incorrect'}
            </Pill>
          )}
          <Pill tone="info">{question.type.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')}</Pill>
          <Pill tone="info">
            {question.points} point{question.points === 1 ? '' : 's'}
          </Pill>
        </QuestionMeta>
      </QuestionHeader>

      {question.type === 'short-answer' ? (
        teacherMode ? (
          <div>
            <strong>Candidate answer:</strong> {getAnswerLabel(question, teacherAnswer)}
            <Feedback $correct={answerIsCorrect}>{answerIsCorrect ? 'Matches expected answer' : 'Needs review'}</Feedback>
          </div>
        ) : (
          <>
            <AnswerInput
              aria-label="Short answer"
              value={currentAnswer}
              readOnly={readOnly}
              onChange={(event) => updateAnswer(event.target.value)}
              placeholder={mode === QUESTION_RENDERER_MODES.DEMO ? 'Demo answer' : 'Type your answer'}
            />
            {showCorrectAnswer && (
              <Feedback $correct={answerIsCorrect}>
                Expected Answer: {getInfo(question).expectedAnswer || 'N/A'}
              </Feedback>
            )}
          </>
        )
      ) : (
        <Options>
          {getOptions(question).map((option, index) => {
            const selected = optionIsSelected(index)
            const correct = revealCorrect && optionIsCorrect(index)
            const incorrect = revealCorrect && selected && !correct
            return (
              <OptionWrapper  key={`${question.id || question._id}-${index}`}>
                {revealCorrect && (
                  <CorrectIncorrectWrapper>
                  {(selected || correct) && (
                    <>
                    {correct ? <CheckCircle
                      sx={{
                        fill: green,
                      }}
                    /> : <Cancel
                      sx={{
                        fill: red,
                      }}
                    />}
                    </>
                  )}
                  </CorrectIncorrectWrapper>
                )}
              <Option $selected={selected && !revealCorrect} $correct={correct} $incorrect={incorrect} $disabled={readOnly}>
                {question.type === 'single-choice' ? (
                  <Radio
                  checked={selected}
                  onChange={() => toggleOption(index)}
                  name={`option-${index + 1}`}
                  disabled={readOnly}
                  />
                ): (
                  <CheckBox
                    checked={selected}
                    onChange={() => toggleOption(index)}
                    name={`option-${index + 1}`}
                    disabled={readOnly}
                  />
                )}
                <OptionText>{option}</OptionText>
              </Option>
              </OptionWrapper>
            )
          })}
          {revealCorrect && (
            <Feedback $correct={answerIsCorrect}>
              {answerIsCorrect ? 'Correct answer' : 'Candidate answer differs from the answer key'}
            </Feedback>
          )}
        </Options>
      )}

      {teacherMode && onScore && (
        <label>
          Score
          <ScoreField type="number" min="0" max={question.points} step="0.5" value={score ?? ''} onChange={(event) => onScore(event.target.value)} />
          / {question.points}
        </label>
      )}
    </QuestionCard>
  )
}