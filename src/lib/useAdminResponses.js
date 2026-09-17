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

    async function fetchAll() {
      if (!supabase) {
        throw new Error('Survey storage is not configured.')
      }

      const pageSize = 1000
      const rows = []
      for (let from = 0; ; from += pageSize) {
        const { data, error: fetchError } = await supabase
          .from('submission_answers')
          .select('submission_id, created_at, question_name, response')
          .range(from, from + pageSize - 1)

        if (fetchError) throw fetchError
        rows.push(...data)
        if (data.length < pageSize) break
      }
      return rows
    }

    fetchAll()
      .then((data) => {
        if (ignore) return
        setError('')
        setResponses(groupSubmissionAnswers(data))
        setLoading(false)
      })
      .catch((fetchError) => {
        if (ignore) return
        setError(fetchError.message)
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
