import { Fragment } from 'react'
import * as Icons from 'lucide-react'
import { MessageCircle } from 'lucide-react'

function RatingScale({ name, options, value, onChange, cols4 }) {
  return (
    <fieldset className={`grid gap-2 ${cols4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-5'}`}>
      <legend className="sr-only">Rating options for {name}</legend>
      {options.map((option) => {
        const id = `${name}_${option}`
        const checked = value === option
        return (
          <label
            key={option}
            htmlFor={id}
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
              checked
                ? 'border-[#4A154B] bg-[#F3E5F3] text-[#4A154B]'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              id={id}
              name={name}
              value={option}
              checked={checked}
              onChange={() => onChange(name, option)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={`h-3.5 w-3.5 flex-none rounded-full border-2 ${
                checked ? 'border-[#4A154B] bg-[#4A154B]' : 'border-slate-300'
              }`}
            />
            <span>{option}</span>
          </label>
        )
      })}
    </fieldset>
  )
}

function MatrixRow({ row, options, value, onChange, hasError }) {
  return (
    <tr
      className={`mb-3 block rounded-xl border p-4 sm:mb-0 sm:table-row sm:rounded-none sm:border-0 sm:p-0 ${
        hasError ? 'border-red-300 bg-red-50/60 sm:bg-red-50/60' : 'border-slate-200'
      }`}
    >
      <th
        scope="row"
        className="mb-2 block w-full border-b border-slate-100 pb-2 text-left text-sm font-semibold text-[#4A154B] sm:mb-0 sm:table-cell sm:w-auto sm:border-0 sm:p-3 sm:text-sm sm:font-medium sm:text-slate-700"
      >
        {row.label}
      </th>
      {options.map((option) => (
        <td key={option} className="flex items-center justify-between py-1.5 sm:table-cell sm:p-3 sm:py-3 sm:text-center">
          <span className="text-sm text-slate-500 sm:hidden">{option}</span>
          <label className="inline-flex cursor-pointer items-center justify-center" aria-label={`${row.label} - ${option}`}>
            <input
              type="radio"
              name={row.name}
              value={option}
              checked={value === option}
              onChange={() => onChange(row.name, option)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={`h-4 w-4 rounded-full border-2 ${
                value === option ? 'border-[#4A154B] bg-[#4A154B]' : 'border-slate-300'
              }`}
            />
          </label>
        </td>
      ))}
    </tr>
  )
}

function MatrixTable({ question, answers, onChange, errors }) {
  const options = RATING_OPTIONS
  const rowGroups = question.groups ? question.groups : [{ rows: question.rows }]
  return (
    <div className="rounded-xl border-0 sm:overflow-x-auto sm:rounded-xl sm:border sm:border-slate-200">
      <table className="block w-full border-collapse text-sm sm:table sm:min-w-[560px]">
        <thead className="hidden sm:table-header-group">
          <tr className="border-b border-slate-200 bg-slate-50">
            <th scope="col" className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Aspect
            </th>
            {options.map((option) => (
              <th
                key={option}
                scope="col"
                className="p-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {option}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="block sm:table-row-group sm:divide-y sm:divide-slate-100">
          {rowGroups.map((group, gi) => (
            <Fragment key={group.title || gi}>
              {group.title ? (
                <tr className="mb-2 block rounded-lg bg-[#F3E5F3] sm:mb-0 sm:table-row sm:rounded-none">
                  <td
                    colSpan={options.length + 1}
                    className="block px-3 py-2 text-xs font-semibold text-[#4A154B] sm:table-cell"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <GroupIcon name={group.icon} />
                      {group.title}
                    </span>
                  </td>
                </tr>
              ) : null}
              {group.rows.map((row) => (
                <MatrixRow
                  key={row.name}
                  row={row}
                  options={options}
                  value={answers[row.name]}
                  onChange={onChange}
                  hasError={errors.has(row.name)}
                />
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function GroupIcon({ name }) {
  const Icon = Icons[name]
  if (!Icon) return null
  return <Icon size={14} aria-hidden="true" />
}

function CheckboxGroup({ question, value, onToggle }) {
  const selected = Array.isArray(value) ? value : []
  return (
    <div role="group" aria-label={question.label} className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      {question.options.map((option) => {
        const Icon = Icons[option.icon] || MessageCircle
        const checked = selected.includes(option.value)
        return (
          <label
            key={option.value}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              checked ? 'border-[#4A154B] bg-[#F3E5F3] text-[#4A154B]' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <input
              type="checkbox"
              name={question.name}
              value={option.value}
              checked={checked}
              onChange={() => onToggle(question.name, option.value)}
              className="sr-only"
            />
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-white/70 text-[#4A154B]">
              <Icon size={16} aria-hidden="true" />
            </span>
            <span className="flex-1">{option.label}</span>
            <span
              aria-hidden="true"
              className={`h-4 w-4 flex-none rounded border-2 ${checked ? 'border-[#4A154B] bg-[#4A154B]' : 'border-slate-300'}`}
            />
          </label>
        )
      })}
    </div>
  )
}

const RATING_OPTIONS = ['Excellent', 'Good', 'Fair', 'Poor', 'N/A']

export default function QuestionCard({ question, answers, onChange, onToggleCheckbox, errors }) {
  const isOptional = !question.required
  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm transition-colors sm:p-6 ${
        errors.size > 0 ? 'border-red-300' : 'border-slate-200'
      }`}
    >
      <header className="mb-4 flex items-start gap-3">
        <span className="flex-none rounded-full bg-[#F3E5F3] px-2.5 py-1 text-xs font-semibold text-[#4A154B]">
          Q{question.number}
        </span>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-slate-800">
            {question.label}
            {question.required && <span className="ml-1 text-red-500">*</span>}
          </h2>
          {isOptional && (
            <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              Optional
            </span>
          )}
          {question.helper && <p className="mt-1 text-sm text-slate-500">{question.helper}</p>}
        </div>
      </header>

      {question.type === 'rating' && (
        <RatingScale
          name={question.name}
          options={question.options}
          value={answers[question.name]}
          onChange={onChange}
          cols4={question.options.length === 4}
        />
      )}

      {question.type === 'matrix' && (
        <MatrixTable question={question} answers={answers} onChange={onChange} errors={errors} />
      )}

      {question.type === 'checkboxGroup' && (
        <CheckboxGroup question={question} value={answers[question.name]} onToggle={onToggleCheckbox} />
      )}

      {question.type === 'textarea' && (
        <textarea
          name={question.name}
          rows={3}
          placeholder="Optional comment..."
          value={answers[question.name] || ''}
          onChange={(e) => onChange(question.name, e.target.value)}
          className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 focus:border-[#4A154B] focus:outline-none focus:ring-1 focus:ring-[#4A154B]"
        />
      )}

      {errors.size > 0 && (
        <p role="alert" className="mt-3 flex items-center gap-1.5 text-sm font-medium text-red-600">
          <Icons.AlertCircle size={15} aria-hidden="true" />
          Please provide a rating or select N/A to continue
        </p>
      )}
    </article>
  )
}
