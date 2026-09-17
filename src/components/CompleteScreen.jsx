import { CheckCircle2, Check } from 'lucide-react'
import { sections } from '../data/surveyConfig'

export default function CompleteScreen({ onReview, onRestart }) {
  return (
    <div className="flex flex-col items-center px-4 py-12 text-center sm:px-8">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E5F3] text-[#4A154B]">
        <CheckCircle2 size={32} aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-semibold text-slate-800 sm:text-3xl">Thank You!</h1>
      <p className="mt-3 max-w-xl text-sm text-slate-500 sm:text-base">
        Your feedback for the <strong className="text-slate-700">Seashell Survey 2026</strong> has been received.
        Your valuable insights help us continuously elevate our community standards for Summer 2027.
      </p>

      <div className="mt-8 w-full max-w-md divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white text-left">
        {sections.map((section) => (
          <div key={section.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-slate-600">{section.title}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
              <Check size={12} aria-hidden="true" /> Completed
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReview}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:border-slate-300"
        >
          Review responses
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-xl bg-[#4A154B] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#370E38]"
        >
          Start a new submission
        </button>
      </div>
    </div>
  )
}
