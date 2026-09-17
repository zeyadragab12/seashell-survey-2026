import { useEffect, useState } from 'react'
import { supabase } from './supabase'

// The submission_answers view is one row per (submission, question); the
// admin pages want one row per submission with an { answers: { [question_name]: value } } map.
function groupSubmissionAnswers(rows) {
  const bySubmission = new Map()
  for (const row of rows) {
    let entry = bySubmission.get(row.submission_id)
    if (!entry) {
      entry = { id: row.submission_id, created_at: row.created_at, answers: {} }
      bySubmission.set(row.submission_id, entry)
    }
    entry.answers[row.question_name] = row.response
  }
  return [...bySubmission.values()].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

// Shared submission data + refresh for every admin page, so each route
// doesn't repeat the same fetch/reshape logic.
export function useAdminResponses() {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let ignore = false
    supabase
      .from('submission_answers')
      .select('submission_id, created_at, question_name, response')
      .then(({ data, error: fetchError }) => {
        if (ignore) return
        if (fetchError) {
          setError(fetchError.message)
        } else {
          setError('')
          setResponses(groupSubmissionAnswers(data))
        }
        setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [reloadToken])

  const refresh = () => {
    setLoading(true)
    setReloadToken((n) => n + 1)
  }

  return { responses, loading, error, refresh }
}
