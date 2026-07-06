// Debe coincidir EXACTAMENTE con el constraint CHECK de la base de datos
// (ver columna "ciudad" en las tablas estaciones y perfiles)
export const CIUDADES = [
  'Tegucigalpa',
  'San Pedro Sula',
  'Puerto Cortes',
  'Choloma',
  'La Ceiba',
  'Yoro',
  'La Esperanza',
  'Choluteca',
  'Danli',
  'El Paraiso',
  'San Marcos de Colon',
  'Trojes',
  'Patuca',
]

// Los 18 departamentos oficiales de Honduras
export const DEPARTAMENTOS = [
  'Atlántida',
  'Choluteca',
  'Colón',
  'Comayagua',
  'Copán',
  'Cortés',
  'El Paraíso',
  'Francisco Morazán',
  'Gracias a Dios',
  'Intibucá',
  'Islas de la Bahía',
  'La Paz',
  'Lempira',
  'Ocotepeque',
  'Olancho',
  'Santa Bárbara',
  'Valle',
  'Yoro',
]

export const ESTADOS_FACTURA = ['pendiente', 'aprobada', 'rechazada']

export const formatoLempiras = (valor) =>
  new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(valor || 0)

export const formatoFecha = (isoString) => {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatoGalones = (valor) =>
  new Intl.NumberFormat('es-HN', { maximumFractionDigits: 2 }).format(valor || 0)
