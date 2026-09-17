import { useEffect, useState } from 'react'
import { supabase } from './supabase'

// Tracks the current Supabase auth session, null while unauthenticated,
// undefined until the initial check resolves.
export function useSession() {
  const [session, setSession] = useState(() => (supabase ? undefined : null))

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => subscription.subscription.unsubscribe()
  }, [])

  return session
}
