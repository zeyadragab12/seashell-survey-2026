import SurveyForm from '../components/SurveyForm'

function Survey() {
  return (
    <div className="min-h-screen bg-white px-4 py-10 sm:px-8">
      <main className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-2">
            <span className="-mt-0.5 font-serif text-[40px] font-bold leading-none text-[#4A154B]">G</span>
            <div className="leading-tight">
              <p className="font-serif text-[15px] font-semibold uppercase tracking-wider text-[#4A154B]">
                Communities<span className="align-super text-[10px]">™</span>
              </p>
              <p className="mt-1 flex items-center gap-2 text-[9.5px] font-semibold uppercase tracking-[2.5px] text-slate-700">
                <span className="h-px w-4 flex-1 bg-slate-700" aria-hidden="true" />
                Seashell
                <span className="h-px w-4 flex-1 bg-slate-700" aria-hidden="true" />
              </p>
            </div>
          </div>
          <span className="font-serif text-sm font-medium text-slate-500">Seashell Survey 2026</span>
        </header>

        <SurveyForm />
      </main>
    </div>
  )
}

export default Survey
