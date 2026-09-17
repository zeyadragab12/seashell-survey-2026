import { useState } from 'react'
import { AlertTriangle, LockKeyhole, Waves } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (signInError) setError('Incorrect email or password.')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F6] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-[#EADFE0] bg-white p-8 shadow-[0_20px_48px_-20px_rgba(74,21,75,0.25)]"
      >
        <div className="mb-7 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4A154B] to-[#7A2E7C] text-[#E9C46A] shadow-[0_8px_20px_-6px_rgba(74,21,75,0.55)]">
            <Waves size={24} aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B08A45]">
              Seashell · G Communities
            </p>
            <h1 className="font-serif text-2xl font-semibold text-[#332133]">Admin sign in</h1>
            <p className="mt-1 text-sm text-[#9A8A9C]">Survey 2026 results</p>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-[#9A8A9C]">
          <LockKeyhole size={13} aria-hidden="true" />
          Restricted access
        </div>

        <label className="mb-3 block text-sm font-medium text-[#4A3A4C]">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#EADFE0] px-3 py-2 text-sm outline-none focus:border-[#4A154B]"
          />
        </label>

        <label className="mb-4 block text-sm font-medium text-[#4A3A4C]">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#EADFE0] px-3 py-2 text-sm outline-none focus:border-[#4A154B]"
          />
        </label>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            <AlertTriangle size={15} aria-hidden="true" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-[#4A154B] px-4 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_-4px_rgba(74,21,75,0.5)] transition-colors hover:bg-[#370E38] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
