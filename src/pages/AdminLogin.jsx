import { useState } from 'react'
import { AlertTriangle, LockKeyhole, Waves } from 'lucide-react'
import { supabase } from '../lib/supabase'

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 48 48" width="16" height="16" aria-hidden="true" {...props}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.6 27 35.5 24 35.5c-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C41.5 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  )
}

export default function AdminLogin({ unauthorized = false, unauthorizedEmail = '' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [googleSubmitting, setGoogleSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) setError('Incorrect email or password.')
    } catch {
      setError('Something went wrong signing in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setGoogleSubmitting(true)
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/admin` },
      })
      if (oauthError) {
        setError('Could not start Google sign-in. Please try again.')
        setGoogleSubmitting(false)
      }
    } catch {
      setError('Could not start Google sign-in. Please try again.')
      setGoogleSubmitting(false)
    }
  }

  if (unauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F6] px-4">
        <div className="w-full max-w-sm rounded-3xl border border-[#EADFE0] bg-white p-8 text-center shadow-[0_20px_48px_-20px_rgba(74,21,75,0.25)]">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertTriangle size={24} aria-hidden="true" />
          </span>
          <h1 className="font-serif text-xl font-semibold text-[#332133]">Not authorized</h1>
          <p className="mt-2 text-sm text-[#9A8A9C]">
            {unauthorizedEmail ? <span className="font-medium text-[#6B5B6E]">{unauthorizedEmail}</span> : 'This account'} isn't on
            the admin allowlist for Survey 2026 results.
          </p>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="mt-6 w-full rounded-xl bg-[#4A154B] px-4 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_-4px_rgba(74,21,75,0.5)] transition-colors hover:bg-[#370E38]"
          >
            Try another account
          </button>
        </div>
      </div>
    )
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

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleSubmitting}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E3D5D6] bg-white px-4 py-2.5 text-sm font-medium text-[#332133] transition-colors hover:bg-[#4A154B]/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon />
          {googleSubmitting ? 'Redirecting…' : 'Sign in with Google'}
        </button>

        <div className="mb-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C9B8CA]">
          <span className="h-px flex-1 bg-[#EADFE0]" />
          Or with email
          <span className="h-px flex-1 bg-[#EADFE0]" />
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
