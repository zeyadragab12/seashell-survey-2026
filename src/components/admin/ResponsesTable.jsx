import { useMemo, useState } from 'react'
import { Download, Search } from 'lucide-react'

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

export default function ResponsesTable({ fields, responses }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return responses
    const q = query.trim().toLowerCase()
    return responses.filter((row) =>
      Object.values(row.answers ?? {}).some((value) =>
        (Array.isArray(value) ? value.join(' ') : String(value ?? '')).toLowerCase().includes(q),
      ),
    )
  }, [query, responses])

  return (
    <div className="rounded-2xl border border-[#EADFE0] bg-white p-5 shadow-[0_1px_2px_rgba(74,21,75,0.04)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="relative w-full sm:w-64">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8A9C]" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search responses…"
            className="w-full rounded-xl border border-[#EADFE0] py-2 pl-8 pr-3 text-sm outline-none focus:border-[#4A154B]"
          />
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

      <div className="max-h-96 overflow-auto rounded-xl border border-[#F1E9EA]">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-[#FCFAF9] text-xs uppercase tracking-wide text-[#9A8A9C]">
            <tr>
              <th className="px-3 py-2 font-medium">ID</th>
              <th className="px-3 py-2 font-medium">Submitted</th>
              {fields.map((f) => (
                <th key={f.name} className="px-3 py-2 font-medium">{f.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-t border-[#F1E9EA] align-top hover:bg-[#FCFAF9]">
                <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-[#9A8A9C]" title={row.id}>
                  {row.id.slice(0, 8)}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-[#9A8A9C]">
                  {new Date(row.created_at).toLocaleString()}
                </td>
                {fields.map((f) => {
                  const value = row.answers?.[f.name]
                  return (
                    <td key={f.name} className="px-3 py-2 text-[#4A3A4C]">
                      {Array.isArray(value) ? value.join(', ') : (value ?? '—')}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
