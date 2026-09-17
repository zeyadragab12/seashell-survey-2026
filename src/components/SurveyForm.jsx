import { useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react'
import { sections, TOTAL_STEPS, requiredFieldsForSection } from '../data/surveyConfig'
import { supabase } from '../lib/supabase'
import QuestionCard from './QuestionCard'
import ProgressDots from './ProgressDots'
import CompleteScreen from './CompleteScreen'

function getQuestionErrorFields(question, invalidSet) {
  if (question.type === 'rating') {
    return invalidSet.has(question.name) ? new Set([question.name]) : new Set()
  }
  if (question.type === 'matrix') {
    const rows = question.groups ? question.groups.flatMap((g) => g.rows) : question.rows
    const errored = rows.filter((row) => invalidSet.has(row.name)).map((row) => row.name)
    return new Set(errored)
  }
  return new Set()
}

export default function SurveyForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState({})
  const [invalidFields, setInvalidFields] = useState(new Set())
  const [submitState, setSubmitState] = useState('idle') // idle | submitting | error
  const cardRef = useRef(null)

  const section = sections.find((s) => s.id === currentStep)
  const isComplete = currentStep === TOTAL_STEPS + 1

  const scrollToTop = () => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleChange = (name, value) => {
    setAnswers((prev) => ({ ...prev, [name]: value }))
    setInvalidFields((prev) => {
      if (!prev.has(name)) return prev
      const next = new Set(prev)
      next.delete(name)
      return next
    })
  }

  const handleToggleCheckbox = (name, value) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[name]) ? prev[name] : []
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      return { ...prev, [name]: next }
    })
  }

  const validateStep = () => {
    const required = requiredFieldsForSection(section)
    const missing = required.filter((name) => !answers[name])
    setInvalidFields(new Set(missing))
    return missing.length === 0
  }

  const goToStep = (step) => {
    const clamped = Math.max(1, Math.min(step, TOTAL_STEPS + 1))
    setCurrentStep(clamped)
    setInvalidFields(new Set())
    scrollToTop()
  }

  const handlePrev = () => {
    if (currentStep > 1) goToStep(currentStep - 1)
  }

  const handleNext = async () => {
    if (!validateStep()) {
      scrollToTop()
      return
    }
    if (currentStep < TOTAL_STEPS) {
      goToStep(currentStep + 1)
    } else {
      await submitSurvey()
    }
  }

  const handleJump = (step) => {
    if (step > currentStep && !validateStep()) {
      scrollToTop()
      return
    }
    goToStep(step)
  }

  const submitSurvey = async () => {
    setSubmitState('submitting')
    if (!supabase) {
      setSubmitState('error')
      return
    }

    try {
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('id, name')

      if (questionsError) {
        setSubmitState('error')
        return
      }

      const questionIdByName = new Map(questions.map((q) => [q.name, q.id]))
      const answeredEntries = Object.entries(answers).filter(([, value]) =>
        Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && value !== ''
      )

      // Generated client-side (rather than read back with .select()) because anon can only
      // insert into submissions, not select from it — RLS would reject a RETURNING read.
      const submissionId = crypto.randomUUID()
      const { error: submissionError } = await supabase.from('submissions').insert({ id: submissionId })

      if (submissionError) {
        setSubmitState('error')
        return
      }

      const responseRows = answeredEntries
        .filter(([name]) => questionIdByName.has(name))
        .map(([name, value]) => ({
          submission_id: submissionId,
          question_id: questionIdByName.get(name),
          response: value,
        }))

      const { error: responsesError } = await supabase.from('responses').insert(responseRows)
      if (responsesError) {
        setSubmitState('error')
        return
      }

      setSubmitState('idle')
      goToStep(TOTAL_STEPS + 1)
    } catch {
      setSubmitState('error')
    }
  }

  const handleRestart = () => {
    setAnswers({})
    setInvalidFields(new Set())
    setSubmitState('idle')
    goToStep(1)
  }

  const nextLabel = useMemo(() => section?.nextLabel ?? 'Next Section', [section])

  return (
    <div ref={cardRef} className="mx-auto w-full max-w-3xl">
      {isComplete ? (
        <CompleteScreen onReview={() => goToStep(1)} onRestart={handleRestart} />
      ) : (
        <>
          <div className="mb-8 flex items-center gap-6 pb-2">
            <div className="flex h-25 w-25 flex-none items-center justify-center sm:h-35 sm:w-35">
              <img src={section.heroImage} alt={section.heroAlt} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="hidden h-27.5 w-px flex-none bg-slate-200 sm:block" aria-hidden="true" />
            <div className="flex-1">
              <h1 className="font-serif text-[26px] font-semibold leading-tight text-[#4A154B] sm:text-[34px]">
                {section.title}
              </h1>
              <p className="mt-2 text-sm text-slate-500 sm:text-[15px]">{section.subtitle}</p>
            </div>
          </div>

          <div className="space-y-5">
            {section.questions.map((question) => (
              <QuestionCard
                key={question.number}
                question={question}
                answers={answers}
                onChange={handleChange}
                onToggleCheckbox={handleToggleCheckbox}
                errors={getQuestionErrorFields(question, invalidFields)}
              />
            ))}
          </div>

          {submitState === 'error' && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertTriangle size={16} aria-hidden="true" />
              {supabase
                ? 'Something went wrong submitting your response. Please try again.'
                : 'Survey storage is not configured yet. Ask your administrator to set up the Supabase connection.'}
            </div>
          )}

          <nav className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:items-center sm:justify-between" aria-label="Survey navigation">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="order-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Previous
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={submitState === 'submitting'}
              className="order-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#4A154B] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#370E38] disabled:cursor-not-allowed disabled:opacity-60 sm:order-3"
            >
              {submitState === 'submitting' ? 'Submitting…' : nextLabel}
              {currentStep === TOTAL_STEPS ? (
                <CheckCircle2 size={15} aria-hidden="true" />
              ) : (
                <ArrowRight size={15} aria-hidden="true" />
              )}
            </button>

            <div className="order-3 col-span-2 flex justify-center sm:order-2 sm:col-auto">
              <ProgressDots sections={sections} currentStep={currentStep} onJump={handleJump} />
            </div>
          </nav>
        </>
      )}
    </div>
  )
}
