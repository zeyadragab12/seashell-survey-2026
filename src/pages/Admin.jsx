import { Route, Routes } from 'react-router-dom'
import { useAdminAccess } from '../lib/useAdminAccess'
import { supabase } from '../lib/supabase'
import { useAdminResponses } from '../lib/useAdminResponses'
import AdminLogin from './AdminLogin'
import AdminLayout from '../components/admin/AdminLayout'
import AdminOverview from './AdminOverview'
import AdminSection from './AdminSection'
import AdminResponses from './AdminResponses'

function AdminRoutes() {
  const { responses, loading, error, refresh } = useAdminResponses()

  return (
    <Routes>
      <Route element={<AdminLayout loading={loading} onRefresh={refresh} />}>
        <Route index element={<AdminOverview responses={responses} loading={loading} error={error} />} />
        <Route path="section/:sectionId" element={<AdminSection responses={responses} loading={loading} error={error} />} />
        <Route path="responses" element={<AdminResponses responses={responses} loading={loading} error={error} />} />
      </Route>
    </Routes>
  )
}

export default function Admin() {
  const { status, email } = useAdminAccess()

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F6] px-4 text-center text-sm text-[#9A8A9C]">
        Survey storage is not configured yet. Ask your administrator to set up the Supabase connection.
      </div>
    )
  }

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F6] text-sm text-[#9A8A9C]">Loading…</div>
    )
  }

  if (status === 'authorized') {
    return <AdminRoutes />
  }

  return <AdminLogin unauthorized={status === 'unauthorized'} unauthorizedEmail={email} />
}
