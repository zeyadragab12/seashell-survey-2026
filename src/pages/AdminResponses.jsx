import { sections } from '../data/surveyConfig'
import ResponsesTable from '../components/admin/ResponsesTable'

// Every answerable question, in survey order — used for both the on-screen
// table and the CSV export so admins see and can download the full dataset.
const allFields = sections.flatMap((section) =>
  section.questions.flatMap((q) => {
    if (q.type === 'matrix') {
      const rows = q.groups ? q.groups.flatMap((g) => g.rows) : q.rows
      return rows.map((row) => ({ name: row.name, label: `Q${q.number}: ${row.label}` }))
    }
    return [{ name: q.name, label: `Q${q.number}: ${q.label}` }]
  }),
)

export default function AdminResponses({ responses, loading, error }) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        Could not load responses: {error}
      </div>
    )
  }

  if (!loading && responses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E3D5D6] bg-white px-4 py-10 text-center text-sm text-[#9A8A9C]">
        No responses submitted yet.
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4 font-serif text-xl font-semibold text-[#332133]">Raw responses</h2>
      <ResponsesTable fields={allFields} responses={responses} />
    </div>
  )
}
