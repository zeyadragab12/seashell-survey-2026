import { useEffect, useState } from 'react'
import { useSession } from './useSession'
import { supabase } from './supabase'

// Wraps useSession with the admin_emails allowlist check: any Supabase
// session (Google or email/password) is valid auth, but only sessions whose
// email is on the allowlist may see admin data.
export function useAdminAccess() {
  const session = useSession()
  const [checkedFor, setCheckedFor] = useState(null)
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    if (!session) return
    let ignore = false
    supabase
      .from('admin_emails')
      .select('email')
      .eq('email', session.user.email)
      .maybeSingle()
      .then(({ data }) => {
        if (ignore) return
        setCheckedFor(session.user.email)
        setIsAllowed(Boolean(data))
      })
    return () => {
      ignore = true
    }
  }, [session])

  const email = session?.user.email ?? ''

  if (session === undefined) return { status: 'checking', email }
  if (session === null) return { status: 'signed-out', email }
  if (checkedFor !== email) return { status: 'checking', email }
  return { status: isAllowed ? 'authorized' : 'unauthorized', email }
}
