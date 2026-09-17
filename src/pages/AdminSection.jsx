import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { sections } from '../data/surveyConfig'
import { flattenFields, sectionAverage } from '../lib/analysis'
import RatingCard from '../components/admin/RatingCard'
import CheckboxCard from '../components/admin/CheckboxCard'
import CommentsCard from '../components/admin/CommentsCard'

const { ratingFields, checkboxFields, commentFields } = flattenFields(sections)

export default function AdminSection({ responses, loading, error }) {
  const { sectionId } = useParams()
  const section = sections.find((s) => s.id === Number(sectionId))

  const fields = useMemo(() => {
    if (!section) return null
    return {
      ratingFields: ratingFields.filter((f) => f.section === section.title),
      checkboxFields: checkboxFields.filter((f) => f.section === section.title),
      commentFields: commentFields.filter((f) => f.section === section.title),
    }
  }, [section])

  const average = useMemo(() => {
    if (!fields) return null
    return sectionAverage(responses, fields.ratingFields).average
  }, [responses, fields])

  if (!section) return <Navigate to="/admin" replace />

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
      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-[#EADFE0] bg-gradient-to-r from-white to-[#FBF3E3]/40 p-5">
        <div className="flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-2xl bg-white">
          <img src={section.heroImage} alt={section.heroAlt} className="h-full w-full object-contain p-1.5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-xl font-semibold text-[#332133]">{section.title}</h2>
          <p className="truncate text-sm text-[#9A8A9C]">{section.subtitle}</p>
        </div>
        {average !== null && (
          <span className="flex-none rounded-full bg-[#4A154B] px-3.5 py-1.5 text-sm font-semibold text-white shadow-[0_4px_14px_-4px_rgba(74,21,75,0.5)]">
            {average.toFixed(2)} / 4
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.ratingFields.map((field) => (
          <RatingCard key={field.name} field={field} responses={responses} />
        ))}
        {fields.checkboxFields.map((field) => (
          <CheckboxCard key={field.name} field={field} responses={responses} />
        ))}
      </div>
      {fields.commentFields.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4">
          {fields.commentFields.map((field) => (
            <CommentsCard key={field.name} field={field} responses={responses} />
          ))}
        </div>
      )}
    </div>
  )
}
