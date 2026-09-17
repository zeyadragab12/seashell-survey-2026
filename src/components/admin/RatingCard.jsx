import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ratingDistribution } from '../../lib/analysis'

const COLOR_BY_OPTION = {
  Excellent: '#1E8E5A',
  Good: '#4A154B',
  Fair: '#B08A45',
  Poor: '#C0392B',
  'N/A': '#C9B8CA',
}

export default function RatingCard({ field, responses }) {
  const { distribution, average, scoreCount, naCount } = ratingDistribution(responses, field)

  return (
    <div className="rounded-2xl border border-[#EADFE0] bg-white p-4 shadow-[0_1px_2px_rgba(74,21,75,0.04)]">
      <div className="mb-1 flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[#332133]">{field.label}</p>
        {average !== null && (
          <span className="flex-none rounded-lg bg-[#4A154B]/10 px-2 py-1 text-xs font-semibold text-[#4A154B]">
            {average.toFixed(2)} / 4
          </span>
        )}
      </div>
      <p className="mb-3 text-xs text-[#9A8A9C]">
        {scoreCount} rated response{scoreCount === 1 ? '' : 's'}
        {naCount > 0 ? ` · ${naCount} N/A` : ''}
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={distribution} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1E9EA" />
          <XAxis dataKey="option" tick={{ fontSize: 11, fill: '#9A8A9C' }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9A8A9C' }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: '#FBF3E3' }} contentStyle={{ borderRadius: 12, border: '1px solid #EADFE0', fontSize: 12 }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {distribution.map((d) => (
              <Cell key={d.option} fill={COLOR_BY_OPTION[d.option] ?? '#C9B8CA'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
