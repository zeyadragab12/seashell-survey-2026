import { Fragment, useMemo, useState } from 'react'
import { ChevronDown, Download, MessageSquareText, Search, X } from 'lucide-react'
import { COLOR_BY_OPTION } from './RatingCard'

function toCsvValue(value) {
  const text = Array.isArray(value) ? value.join('; ') : (value ?? '')
  const escaped = String(text).replace(/"/g, '""')
  return `"${escaped}"`
}

function downloadCsv(fields, responses) {
  const header = ['id', 'created_at', ...fields.map((f) => f.label)]
  const rows = responses.map((row) => [
    row.id,
    row.created_at,
    ...fields.map((f) => toCsvValue(row.answers?.[f.name])),
  ])
  const csv = [header.map(toCsvValue).join(','), ...rows.map((r) => r.map(toCsvValue).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `seashell-survey-responses-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// Flattens every value a response row could be searched by — its id, its
// submission date, and every answer (including checkbox arrays) — into one
// lowercase string, so search matches whatever an admin might type.
function searchableText(row) {
  const answerText = Object.values(row.answers ?? {})
    .map((value) => (Array.isArray(value) ? value.join(' ') : String(value ?? '')))
    .join(' ')
  return `${row.id} ${new Date(row.created_at).toLocaleString()} ${answerText}`.toLowerCase()
}

function RatingBadge({ value }) {
  const color = COLOR_BY_OPTION[value] ?? '#9A8A9C'
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ color, background: `${color}1A` }}
    >
      {value}
    </span>
  )
}

function AnswerValue({ field, value }) {
  if (value === undefined || value === null || value === '') {
    return <span className="text-[#C9BCC9]">—</span>
  }
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((v) => (
          <span key={v} className="rounded-full bg-[#4A154B]/8 px-2 py-0.5 text-xs text-[#4A154B]">
            {v}
          </span>
        ))}
      </div>
    )
  }
  if (field.type === 'rating' || field.type === 'matrix_row') {
    return <RatingBadge value={value} />
  }
  return <p className="whitespace-pre-wrap text-sm leading-snug text-[#4A3A4C]">{value}</p>
}

function ResponseDetail({ sectionFields, row }) {
  return (
    <div className="grid gap-4 bg-[#FCFAF9] p-4 sm:grid-cols-2 xl:grid-cols-3">
      {sectionFields.map((section) => {
        const answered = section.fields.filter((f) => row.answers?.[f.name] !== undefined)
        if (answered.length === 0) return null
        return (
          <div key={section.id} className="rounded-xl border border-[#F1E9EA] bg-white p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#B08A45]">{section.title}</p>
            <dl className="space-y-2.5">
              {answered.map((field) => (
                <div key={field.name}>
                  <dt className="mb-0.5 text-[11px] font-medium text-[#9A8A9C]">
                    Q{field.number} · {field.label}
                  </dt>
                  <dd>
                    <AnswerValue field={field} value={row.answers[field.name]} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )
      })}
    </div>
  )
}

export default function ResponsesTable({ fields, sectionFields, responses }) {
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const overallField = fields.find((f) => f.name === 'q24')
  const commentFields = useMemo(() => fields.filter((f) => f.type === 'textarea'), [fields])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return responses
    return responses.filter((row) => searchableText(row).includes(q))
  }, [query, responses])

  return (
    <div className="rounded-2xl border border-[#EADFE0] bg-white p-5 shadow-[0_1px_2px_rgba(74,21,75,0.04)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8A9C]" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by answer, comment, ID or date…"
            className="w-full rounded-xl border border-[#EADFE0] py-2 pl-8 pr-8 text-sm outline-none focus:border-[#4A154B]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9A8A9C] hover:text-[#4A154B]"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => downloadCsv(fields, filtered)}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#E3D5D6] px-3.5 py-2 text-sm font-medium text-[#4A154B] transition-colors hover:bg-[#4A154B]/5"
        >
          <Download size={14} aria-hidden="true" />
          Export full dataset (CSV)
        </button>
      </div>

      <p className="mb-2 text-xs text-[#9A8A9C]">
        {filtered.length} of {responses.length} response{responses.length === 1 ? '' : 's'}
      </p>

      <div className="max-h-[32rem] overflow-auto rounded-xl border border-[#F1E9EA]">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 z-[1] bg-[#FCFAF9] text-xs uppercase tracking-wide text-[#9A8A9C]">
            <tr>
              <th className="w-8 px-3 py-2" />
              <th className="px-3 py-2 font-medium">Submitted</th>
              <th className="px-3 py-2 font-medium">ID</th>
              {overallField && <th className="px-3 py-2 font-medium">Overall</th>}
              <th className="px-3 py-2 font-medium">Comments</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-sm text-[#9A8A9C]">
                  No responses match “{query}”.
                </td>
              </tr>
            )}
            {filtered.map((row) => {
              const isOpen = expandedId === row.id
              const overallValue = overallField ? row.answers?.[overallField.name] : undefined
              const comments = commentFields
                .map((f) => row.answers?.[f.name])
                .filter((v) => typeof v === 'string' && v.trim().length > 0)

              return (
                <Fragment key={row.id}>
                  <tr
                    onClick={() => setExpandedId(isOpen ? null : row.id)}
                    className={`cursor-pointer border-t border-[#F1E9EA] align-top transition-colors hover:bg-[#FCFAF9] ${
                      isOpen ? 'bg-[#FCFAF9]' : ''
                    }`}
                  >
                    <td className="px-3 py-3">
                      <ChevronDown
                        size={15}
                        className={`text-[#9A8A9C] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-[#4A3A4C]">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-[#9A8A9C]" title={row.id}>
                      {row.id.slice(0, 8)}
                    </td>
                    {overallField && (
                      <td className="px-3 py-3">
                        {overallValue ? <RatingBadge value={overallValue} /> : <span className="text-[#C9BCC9]">—</span>}
                      </td>
                    )}
                    <td className="max-w-xs px-3 py-3 text-[#4A3A4C]">
                      {comments.length > 0 ? (
                        <span className="flex items-center gap-1.5">
                          <MessageSquareText size={13} className="flex-none text-[#B08A45]" aria-hidden="true" />
                          <span className="truncate text-xs text-[#6B5B6E]">{comments[0]}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-[#C9BCC9]">No comment</span>
                      )}
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="border-t border-[#F1E9EA]">
                      <td colSpan={5} className="p-0">
                        <ResponseDetail sectionFields={sectionFields} row={row} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
