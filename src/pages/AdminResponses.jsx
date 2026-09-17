import { sections } from '../data/surveyConfig'
import ResponsesTable from '../components/admin/ResponsesTable'

// Every answerable question, grouped by section — used to build both the
// flat field list (CSV export, search) and the per-section breakdown shown
// when a response row is expanded.
const sectionFields = sections.map((section) => ({
  id: section.id,
  title: section.title,
  fields: section.questions.flatMap((q) => {
    if (q.type === 'matrix') {
      const rows = q.groups ? q.groups.flatMap((g) => g.rows) : q.rows
      return rows.map((row) => ({ name: row.name, label: row.label, type: 'matrix_row', number: q.number }))
    }
    return [{ name: q.name, label: q.label, type: q.type, number: q.number }]
  }),
}))

const allFields = sectionFields.flatMap((section) =>
  section.fields.map((f) => ({ ...f, label: `Q${f.number}: ${f.label}` })),
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
      <ResponsesTable fields={allFields} sectionFields={sectionFields} responses={responses} />
    </div>
  )
}
