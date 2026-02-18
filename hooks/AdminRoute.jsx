// src/components/AdminRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAdmin } from '../hooks/useAdmin'

export default function AdminRoute({ children }) {
  const { isAdmin, loading } = useAdmin()

  if (loading) return <div>جاري التحميل...</div>
  
  if (!isAdmin) return <Navigate to="/login" replace />
  
  return children
}