export default function ProgressDots({ sections, currentStep, onJump }) {
  return (
    <div role="tablist" aria-label="Survey section steps" className="flex items-center justify-center gap-2">
      {sections.map((section) => {
        const isActive = section.id === currentStep
        const isCompleted = section.id < currentStep
        return (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Section ${section.id}: ${section.title}`}
            onClick={() => onJump(section.id)}
            className={`h-2.5 rounded-full transition-all ${
              isActive
                ? 'w-7 bg-[#4A154B]'
                : isCompleted
                  ? 'w-2.5 bg-[#7B387C]'
                  : 'w-2.5 bg-slate-200 hover:bg-slate-300'
            }`}
          />
        )
      })}
    </div>
  )
}
