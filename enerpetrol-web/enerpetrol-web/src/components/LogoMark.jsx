// Muestra el ícono del logo real dentro de una placa blanca circular,
// para que se lea bien sobre fondos oscuros (navy).
export default function LogoMark({ size = 22, badgePadding = 'p-1' }) {
  return (
    <span className={`inline-flex items-center justify-center bg-white rounded-full ${badgePadding} shadow-sm shrink-0`}>
      <img
        src="/logo/enerpetrol-icono.png"
        alt="Enerpetrol"
        style={{ width: size, height: size }}
        className="object-contain"
      />
    </span>
  )
}
