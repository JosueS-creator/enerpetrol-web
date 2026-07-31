import { useEffect, useState } from 'react'
import { supabase } from './supabase'

// Maneja la sesión de Supabase y carga el perfil (incluyendo rol) del usuario logueado.
export function useAuth() {
  const [session, setSession] = useState(undefined) // undefined = cargando, null = sin sesión
  const [perfil, setPerfil] = useState(null)
  const [loadingPerfil, setLoadingPerfil] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session?.user?.id) {
      setPerfil(null)
      return
    }
    setLoadingPerfil(true)
    supabase
      .from('perfiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data, error }) => {
        if (error) console.error('Error cargando perfil:', error.message)
        setPerfil(data ?? null)
        setLoadingPerfil(false)
      })
  }, [session?.user?.id])

  return {
    session,
    perfil,
    isLoading: session === undefined || (session && loadingPerfil),
    isAdmin: perfil?.rol === 'admin',
  }
}
