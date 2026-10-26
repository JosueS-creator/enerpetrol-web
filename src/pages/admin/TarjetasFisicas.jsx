import { CreditCard, Download } from 'lucide-react'
export default function TarjetasFisicas() {
  return <div className="p-6 md:p-10">
    <h1 className="text-3xl font-bold text-navy-ink flex items-center gap-3"><CreditCard/> Tarjetas físicas</h1>
    <p className="mt-3 text-slate-600">Solicitudes de tarjeta física Enerpetrol, con descuento de L 2 por galón en cinco estaciones participantes.</p>
    <section className="mt-8 rounded-2xl bg-white shadow-sm p-8 border border-slate-200">
      <h2 className="font-bold text-xl">Registros y exportación Excel</h2>
      <p className="text-slate-600 mt-3">La descarga se habilitará después de configurar el almacenamiento seguro, las políticas de acceso y el registro de auditoría de exportaciones. No se ha conectado una base de datos todavía.</p>
      <button disabled className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-300 text-slate-600 cursor-not-allowed"><Download size={18}/> Descargar Excel (pendiente)</button>
    </section>
  </div>
}
