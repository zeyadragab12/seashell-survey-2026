import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LogOut, Menu, RefreshCw, X } from 'lucide-react'
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
  const [navOpen, setNavOpen] = useState(false)

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
          <div className="flex items-center gap-2">
            <div className="hidden flex-col items-stretch gap-2 sm:flex sm:flex-row">
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
            <button
              type="button"
              onClick={() => setNavOpen((open) => !open)}
              aria-expanded={navOpen}
              aria-controls="admin-nav"
              className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full border border-[#E3D5D6] bg-white text-[#4A154B] transition-colors hover:border-[#4A154B]/40 hover:bg-[#4A154B]/5 sm:hidden"
            >
              {navOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              <span className="sr-only">Toggle admin menu</span>
            </button>
          </div>
        </div>

        <nav
          id="admin-nav"
          aria-label="Admin sections"
          className={`mx-auto w-full max-w-6xl overflow-hidden px-4 transition-all duration-300 ease-in-out sm:!max-h-none sm:overflow-visible sm:px-8 sm:pb-4 sm:opacity-100 ${
            navOpen ? 'max-h-[480px] pb-4 opacity-100' : 'max-h-0 pb-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap">
            <NavLink to="/admin" end className={navLinkClass} onClick={() => setNavOpen(false)}>
              Overview
            </NavLink>
            {sections.map((section) => (
              <NavLink
                key={section.id}
                to={`/admin/section/${section.id}`}
                className={navLinkClass}
                onClick={() => setNavOpen(false)}
              >
                {section.title}
              </NavLink>
            ))}
            <NavLink to="/admin/responses" className={navLinkClass} onClick={() => setNavOpen(false)}>
              Raw responses
            </NavLink>
            <div className="mt-2 flex items-stretch gap-1.5 border-t border-[#EADFE0] pt-3 sm:hidden">
              <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-[#E3D5D6] bg-white px-2.5 py-1.5 text-xs font-medium text-[#4A154B] transition-colors hover:border-[#4A154B]/40 hover:bg-[#4A154B]/5 disabled:opacity-60"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
                Refresh
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-[#4A154B] px-2.5 py-1.5 text-xs font-medium text-white shadow-[0_4px_14px_-4px_rgba(74,21,75,0.55)] transition-colors hover:bg-[#370E38]"
              >
                <LogOut size={12} aria-hidden="true" />
                Sign out
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
        <Outlet />
      </main>
    </div>
  )
}
