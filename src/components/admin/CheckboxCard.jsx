import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { checkboxTally } from '../../lib/analysis'

export default function CheckboxCard({ field, responses }) {
  const tally = checkboxTally(responses, field)
  const total = tally.reduce((sum, t) => sum + t.count, 0)

  return (
    <div className="rounded-2xl border border-[#EADFE0] bg-white p-4 shadow-[0_1px_2px_rgba(74,21,75,0.04)]">
      <p className="mb-1 text-sm font-medium text-[#332133]">{field.label}</p>
      <p className="mb-3 text-xs text-[#9A8A9C]">{total} selection{total === 1 ? '' : 's'} total</p>
      <ResponsiveContainer width="100%" height={Math.max(120, tally.length * 34)}>
        <BarChart
          data={tally}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1E9EA" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#9A8A9C' }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="option"
            width={180}
            tick={{ fontSize: 11, fill: '#5A4A5C' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip cursor={{ fill: '#FBF3E3' }} contentStyle={{ borderRadius: 12, border: '1px solid #EADFE0', fontSize: 12 }} />
          <Bar dataKey="count" fill="#4A154B" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
