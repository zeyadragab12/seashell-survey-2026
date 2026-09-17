import { useMemo } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts'
import { Gauge, MessageSquareText, TrendingUp, Users } from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#EADFE0] bg-white p-5 shadow-[0_1px_2px_rgba(74,21,75,0.04)] transition-shadow hover:shadow-[0_8px_24px_-8px_rgba(74,21,75,0.18)]">
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-[0.08]"
        style={{ background: accent ?? '#4A154B' }}
      />
      <span
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-[0_4px_12px_-4px_rgba(74,21,75,0.4)]"
        style={{ background: accent ?? '#4A154B' }}
      >
        <Icon size={18} aria-hidden="true" />
      </span>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9A8A9C]">{label}</p>
      <p className="mt-0.5 font-serif text-2xl font-semibold text-[#332133]">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-[#9A8A9C]">{sub}</p>}
    </div>
  )
}

// Buckets submissions by day and returns a running cumulative count, so the
// sparkline reads as "responses collected over time" rather than noisy
// per-day counts.
function buildTrend(responses) {
  if (responses.length === 0) return []
  const byDay = new Map()
  for (const row of responses) {
    const day = new Date(row.created_at).toISOString().slice(0, 10)
    byDay.set(day, (byDay.get(day) ?? 0) + 1)
  }
  const days = [...byDay.keys()].sort()
  let running = 0
  return days.map((day) => {
    running += byDay.get(day)
    return { day, total: running }
  })
}

export default function SummaryHeader({ responses, overallAverage, commentCount }) {
  const trend = useMemo(() => buildTrend(responses), [responses])
  const lastResponseAt = responses[0]?.created_at

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Users}
        label="Total responses"
        value={responses.length}
        sub={lastResponseAt ? `Last: ${new Date(lastResponseAt).toLocaleDateString()}` : undefined}
        accent="#4A154B"
      />
      <StatCard
        icon={Gauge}
        label="Overall average"
        value={overallAverage !== null ? `${overallAverage.toFixed(2)} / 4` : '—'}
        sub="Based on Q24"
        accent="#B08A45"
      />
      <StatCard
        icon={MessageSquareText}
        label="Written comments"
        value={commentCount}
        sub="Across all sections"
        accent="#7A2E7C"
      />
      <div className="rounded-2xl border border-[#EADFE0] bg-white p-5 shadow-[0_1px_2px_rgba(74,21,75,0.04)]">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#9A8A9C]">
          <TrendingUp size={13} aria-hidden="true" />
          Responses over time
        </div>
        {trend.length > 1 ? (
          <ResponsiveContainer width="100%" height={52}>
            <AreaChart data={trend} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A154B" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#4A154B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={['dataMin', 'dataMax']} />
              <Tooltip
                cursor={false}
                labelFormatter={(day) => new Date(day).toLocaleDateString()}
                formatter={(value) => [value, 'Total responses']}
                contentStyle={{ borderRadius: 12, border: '1px solid #EADFE0', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="total" stroke="#4A154B" strokeWidth={2} fill="url(#trendFill)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="flex h-14 items-center text-sm text-[#9A8A9C]">Not enough data yet</p>
        )}
      </div>
    </div>
  )
}
