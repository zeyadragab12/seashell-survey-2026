import { NavLink, Outlet } from 'react-router-dom'
import { LogOut, RefreshCw } from 'lucide-react'
import { sections } from '../../data/surveyConfig'
import { supabase } from '../../lib/supabase'

function handleSignOut() {
  supabase?.auth.signOut().catch(() => {})
}

function navLinkClass({ isActive }) {
  return `whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
    isActive
      ? 'bg-[#4A154B] text-white shadow-[0_4px_14px_-4px_rgba(74,21,75,0.55)]'
      : 'text-[#6B5B6E] hover:bg-[#4A154B]/8 hover:text-[#4A154B]'
  }`
}

export default function AdminLayout({ loading, onRefresh }) {
  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      <header className="sticky top-0 z-10 border-b border-[#EADFE0] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 flex-none text items-center justify-center text-4xl">
             G
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B08A45]">
                Seashell · G Communities
              </p>
              <h1 className="font-serif text-xl font-semibold leading-tight text-[#4A154B]">
                Survey 2026 Results
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#E3D5D6] bg-white px-4 py-2 text-sm font-medium text-[#4A154B] transition-colors hover:border-[#4A154B]/40 hover:bg-[#4A154B]/5 disabled:opacity-60"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#4A154B] px-4 py-2 text-sm font-medium text-white shadow-[0_4px_14px_-4px_rgba(74,21,75,0.55)] transition-colors hover:bg-[#370E38]"
            >
              <LogOut size={14} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>

        <nav
          aria-label="Admin sections"
          className="mx-auto flex w-full max-w-6xl flex-wrap gap-1.5 px-4 pb-4 sm:px-8"
        >
          <NavLink to="/admin" end className={navLinkClass}>
            Overview
          </NavLink>
          {sections.map((section) => (
            <NavLink key={section.id} to={`/admin/section/${section.id}`} className={navLinkClass}>
              {section.title}
            </NavLink>
          ))}
          <NavLink to="/admin/responses" className={navLinkClass}>
            Raw responses
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
        <Outlet />
      </main>
    </div>
  )
}
