import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { sections } from '../data/surveyConfig'
import { flattenFields, ratingDistribution, sectionAverage } from '../lib/analysis'
import SummaryHeader from '../components/admin/SummaryHeader'

const { ratingFields, commentFields } = flattenFields(sections)

function scoreTone(average) {
  if (average === null) return { text: 'text-[#9A8A9C]', bg: 'bg-[#F4EFF0]' }
  if (average >= 3.5) return { text: 'text-emerald-700', bg: 'bg-emerald-50' }
  if (average >= 2.5) return { text: 'text-[#B08A45]', bg: 'bg-[#FBF3E3]' }
  return { text: 'text-red-700', bg: 'bg-red-50' }
}

export default function AdminOverview({ responses, loading, error }) {
  const overallAverage = useMemo(() => {
    if (responses.length === 0) return null
    const field = ratingFields.find((f) => f.name === 'q24')
    if (!field) return null
    return ratingDistribution(responses, field).average
  }, [responses])

  const commentCount = useMemo(
    () => responses.reduce((sum, row) => sum + commentFields.filter((f) => (row.answers?.[f.name] ?? '').trim()).length, 0),
    [responses],
  )

  const sectionSummaries = useMemo(
    () =>
      sections.map((section) => {
        const sectionRatingFields = ratingFields.filter((f) => f.section === section.title)
        return { ...section, ...sectionAverage(responses, sectionRatingFields) }
      }),
    [responses],
  )

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
      {responses.length > 0 && (
        <SummaryHeader responses={responses} overallAverage={overallAverage} commentCount={commentCount} />
      )}

      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-serif text-xl font-semibold text-[#332133]">Sections at a glance</h2>
        <p className="text-xs text-[#9A8A9C]">Tap a section for the full breakdown</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sectionSummaries.map((section) => {
          const tone = scoreTone(section.average)
          return (
            <Link
              key={section.id}
              to={`/admin/section/${section.id}`}
              className="group relative overflow-hidden rounded-2xl border border-[#EADFE0] bg-white shadow-[0_1px_2px_rgba(74,21,75,0.04)] transition-all hover:-translate-y-0.5 hover:border-[#4A154B]/30 hover:shadow-[0_12px_28px_-10px_rgba(74,21,75,0.25)]"
            >
              <div className="flex items-center gap-4 p-5">
                <div className="flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-2xl">
                  <img src={section.heroImage} alt={section.heroAlt} className="h-full w-full object-contain p-1.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-base font-semibold text-[#332133]">{section.title}</p>
                  <p className="text-xs text-[#9A8A9C]">{section.count} rating answers</p>
                </div>
                <ArrowUpRight
                  size={16}
                  className="flex-none text-[#C9B8CA] transition-colors group-hover:text-[#4A154B]"
                  aria-hidden="true"
                />
              </div>
              <div className="flex items-center justify-between border-t border-[#F1E9EA] bg-[#FCFAF9] px-5 py-3">
                <span className="text-xs font-medium text-[#9A8A9C]">Average score</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone.bg} ${tone.text}`}>
                  {section.average !== null ? `${section.average.toFixed(2)} / 4` : 'No data yet'}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
