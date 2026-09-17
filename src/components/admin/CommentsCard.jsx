import { MessageCircle } from 'lucide-react'
import { comments } from '../../lib/analysis'

export default function CommentsCard({ field, responses }) {
  const items = comments(responses, field)
  if (items.length === 0) return null

  return (
    <div className="rounded-2xl border border-[#EADFE0] bg-white p-4 shadow-[0_1px_2px_rgba(74,21,75,0.04)]">
      <p className="mb-1 text-sm font-medium text-[#332133]">{field.label}</p>
      <p className="mb-3 text-xs text-[#9A8A9C]">{items.length} comment{items.length === 1 ? '' : 's'}</p>
      <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={item.id} className="flex gap-2 rounded-xl bg-[#FCFAF9] px-3 py-2.5 text-sm text-[#4A3A4C]">
            <MessageCircle size={14} className="mt-0.5 flex-none text-[#C9B8CA]" aria-hidden="true" />
            <div>
              {item.text}
              <div className="mt-1 text-[11px] text-[#9A8A9C]">{new Date(item.createdAt).toLocaleString()}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
