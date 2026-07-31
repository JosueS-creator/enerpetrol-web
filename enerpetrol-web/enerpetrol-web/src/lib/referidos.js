import { supabase } from './supabase'

const VIGENCIA_REFERIDOS = new Date('2026-08-15T23:59:59')

/**
 * Se llama justo después de que una factura queda en estado 'aprobada'.
 * Si es la PRIMERA factura aprobada de ese cliente, y el cliente fue referido
 * por alguien que no está excluido del programa, se le acredita 1 Enermoneda
 * al referidor y se le crea una notificación. No hace nada si no aplica.
 */
export async function procesarReferidoSiAplica(clienteId) {
  if (new Date() > VIGENCIA_REFERIDOS) return { aplico: false, motivo: 'programa_vencido' }

  const { count, error: errConteo } = await supabase
    .from('facturas')
    .select('id', { count: 'exact', head: true })
    .eq('cliente_id', clienteId)
    .eq('estado', 'aprobada')

  if (errConteo) return { aplico: false, motivo: 'error_conteo', error: errConteo }
  if (count !== 1) return { aplico: false, motivo: 'no_es_primera_factura' }

  const { data: referido, error: errReferido } = await supabase
    .from('referidos')
    .select('*')
    .eq('referido_id', clienteId)
    .eq('punto_otorgado', false)
    .limit(1)
    .maybeSingle()

  if (errReferido || !referido) return { aplico: false, motivo: 'sin_referido_pendiente' }

  const { data: referidor, error: errPerfil } = await supabase
    .from('perfiles')
    .select('id, nombre, galones_acumulados, excluido_referidos')
    .eq('id', referido.referidor_id)
    .single()

  if (errPerfil || !referidor) return { aplico: false, motivo: 'referidor_no_encontrado' }
  if (referidor.excluido_referidos) return { aplico: false, motivo: 'referidor_excluido' }

  const nuevoSaldo = (referidor.galones_acumulados || 0) + 1

  const { error: errUpdatePerfil } = await supabase
    .from('perfiles')
    .update({ galones_acumulados: nuevoSaldo })
    .eq('id', referidor.id)
  if (errUpdatePerfil) return { aplico: false, motivo: 'error_acreditar', error: errUpdatePerfil }

  await supabase.from('referidos').update({ punto_otorgado: true }).eq('id', referido.id)

  await supabase.from('notificaciones').insert({
    usuario_id: referidor.id,
    mensaje: '¡Ganaste 1 Enermoneda! Tu referido realizó su primera compra aprobada en Enerpetrol.',
  })

  return { aplico: true, referidor: referidor.nombre }
}
