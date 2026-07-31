import { X } from 'lucide-react'

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between px-8 pt-8 pb-6 flex-wrap gap-4">
      <div>
        <h1 className="font-display text-2xl text-navy">{title}</h1>
        {subtitle && <p className="text-navy/50 text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function StatCard({ label, value, icon: Icon, accent = 'verde' }) {
  const accentClasses = {
    verde: 'text-verde bg-verde/10',
    amber: 'text-gas-amberDark bg-gas-amber/15',
    navy: 'text-navy bg-navy/10',
  }
  return (
    <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${accentClasses[accent]}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-mono text-navy">{value}</p>
      <p className="text-navy/50 text-xs uppercase tracking-wide mt-1">{label}</p>
    </div>
  )
}

export function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 bg-navy-ink/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className={`bg-white rounded-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto thin-scroll`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-navy/10 sticky top-0 bg-white">
          <h2 className="font-display text-lg text-navy">{title}</h2>
          <button onClick={onClose} className="text-navy/40 hover:text-navy" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function Badge({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-navy/10 text-navy',
    verde: 'bg-verde/15 text-verde-dark',
    amber: 'bg-gas-amber/20 text-gas-amberDark',
    red: 'bg-red-100 text-red-600',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}
