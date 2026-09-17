// Turns raw survey_responses rows into per-question aggregates for the admin dashboard,
// using the same sections schema the survey form renders from.

export const SCORE_BY_RATING = { Excellent: 4, Good: 3, Fair: 2, Poor: 1 }

// Flattens sections into one list of scoreable fields (rating + matrix rows) and
// one list of checkbox-group fields, each carrying its question label for display.
export function flattenFields(sections) {
  const ratingFields = []
  const checkboxFields = []
  const commentFields = []

  for (const section of sections) {
    for (const q of section.questions) {
      if (q.type === 'rating') {
        ratingFields.push({ name: q.name, label: q.label, section: section.title, options: q.options })
      } else if (q.type === 'matrix') {
        const rows = q.groups ? q.groups.flatMap((g) => g.rows) : q.rows
        rows.forEach((row) => {
          ratingFields.push({ name: row.name, label: row.label, section: section.title, options: q.options ?? Object.keys(SCORE_BY_RATING) })
        })
      } else if (q.type === 'checkboxGroup') {
        checkboxFields.push({ name: q.name, label: q.label, section: section.title, options: q.options })
      } else if (q.type === 'textarea') {
        commentFields.push({ name: q.name, label: q.label, section: section.title })
      }
    }
  }

  return { ratingFields, checkboxFields, commentFields }
}

// Returns [{ option, count }] in the field's declared option order, plus an
// average score (excluding N/A) when at least one scoreable answer exists.
export function ratingDistribution(responses, field) {
  const options = field.options ?? Object.keys(SCORE_BY_RATING)
  const counts = Object.fromEntries(options.map((o) => [o, 0]))
  let scoreSum = 0
  let scoreCount = 0

  for (const row of responses) {
    const value = row.answers?.[field.name]
    if (!value || !(value in counts)) continue
    counts[value] += 1
    if (value in SCORE_BY_RATING) {
      scoreSum += SCORE_BY_RATING[value]
      scoreCount += 1
    }
  }

  return {
    distribution: options.map((option) => ({ option, count: counts[option] })),
    average: scoreCount ? scoreSum / scoreCount : null,
    responded: scoreCount + (counts['N/A'] ?? 0),
  }
}

// Returns [{ option, count }] sorted by count desc for a checkbox-group field.
export function checkboxTally(responses, field) {
  const counts = Object.fromEntries(field.options.map((o) => [o.value, 0]))
  for (const row of responses) {
    const value = row.answers?.[field.name]
    if (!Array.isArray(value)) continue
    value.forEach((v) => {
      if (v in counts) counts[v] += 1
    })
  }
  return field.options
    .map((o) => ({ option: o.value, count: counts[o.value] }))
    .sort((a, b) => b.count - a.count)
}

// Non-empty free-text answers for a textarea field, newest first.
export function comments(responses, field) {
  return responses
    .filter((row) => (row.answers?.[field.name] ?? '').trim().length > 0)
    .map((row) => ({ id: row.id, createdAt: row.created_at, text: row.answers[field.name].trim() }))
}

// Average score (1-4, excluding N/A) across every rating field belonging to
// one section, plus how many answers fed into it. Returns average: null when
// nothing scoreable has been answered yet.
export function sectionAverage(responses, ratingFields) {
  let scoreSum = 0
  let scoreCount = 0
  for (const field of ratingFields) {
    for (const row of responses) {
      const value = row.answers?.[field.name]
      if (value in SCORE_BY_RATING) {
        scoreSum += SCORE_BY_RATING[value]
        scoreCount += 1
      }
    }
  }
  return { average: scoreCount ? scoreSum / scoreCount : null, count: scoreCount }
}
