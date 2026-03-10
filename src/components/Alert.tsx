import type { AlertComponent } from '@/types'

export default function Alert({ alertType, title, message }: AlertComponent) {
  const styles = {
    info: {
      container: 'bg-blue-50 border-blue-100',
      icon: (
        <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      titleColor: 'text-blue-900',
      textColor: 'text-blue-700'
    },
    success: {
      container: 'bg-emerald-50 border-emerald-100',
      icon: (
        <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      titleColor: 'text-emerald-900',
      textColor: 'text-emerald-700'
    },
    warning: {
      container: 'bg-amber-50 border-amber-100',
      icon: (
        <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      titleColor: 'text-amber-900',
      textColor: 'text-amber-700'
    },
    error: {
      container: 'bg-rose-50 border-rose-100',
      icon: (
        <svg className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      titleColor: 'text-rose-900',
      textColor: 'text-rose-700'
    }
  }

  const style = styles[alertType]

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${style.container}`}>
      {style.icon}
      <div className="flex-1">
        {title && <h4 className={`font-semibold mb-0.5 ${style.titleColor}`}>{title}</h4>}
        <p className={`text-sm ${style.textColor}`}>{message}</p>
      </div>
    </div>
  )
}
