import { supabase } from './supabase'

// Hace un PATCH (update) directo a la API REST de Supabase, adjuntando el
// token de la sesión actual a mano. Existe porque en este proyecto detectamos
// que el cliente supabase-js a veces no adjunta el token correctamente en
// llamadas .update(), mientras que un fetch() directo con el mismo token
// siempre funciona.
export async function supaUpdate(tabla, filtroQueryString, cambios) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/${tabla}?${filtroQueryString}`

  const resp = await fetch(url, {
    method: 'PATCH',
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + session?.access_token,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(cambios),
  })

  const texto = await resp.text()
  let data = null
  try {
    data = texto ? JSON.parse(texto) : null
  } catch {
    // respuesta no era JSON, se deja data en null
  }

  if (!resp.ok) {
    return { data: null, error: { message: (data && (data.message || data.hint)) || texto || `HTTP ${resp.status}` } }
  }
  return { data, error: null }
}
