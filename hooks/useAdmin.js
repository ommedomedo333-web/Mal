// src/hooks/useAdmin.js
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const role = user.app_metadata?.role
        setIsAdmin(role === 'admin')
      }
      
      setLoading(false)
    }

    checkAdmin()
  }, [])

  return { isAdmin, loading }
}