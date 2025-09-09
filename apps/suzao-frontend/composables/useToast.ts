interface ToastOptions {
  duration?: number
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  persistent?: boolean
}

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  options: ToastOptions
  createdAt: number
}

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])

  const addToast = (type: Toast['type'], message: string, options: ToastOptions = {}) => {
    const id = Date.now().toString()
    const toast: Toast = {
      id,
      type,
      message,
      options: {
        duration: 3000,
        position: 'top-right',
        persistent: false,
        ...options
      },
      createdAt: Date.now()
    }

    toasts.value.push(toast)

    if (!toast.options.persistent && toast.options.duration) {
      setTimeout(() => {
        removeToast(id)
      }, toast.options.duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearToasts = () => {
    toasts.value = []
  }

  const success = (message: string, options?: ToastOptions) =>
    addToast('success', message, options)

  const error = (message: string, options?: ToastOptions) =>
    addToast('error', message, options)

  const warning = (message: string, options?: ToastOptions) =>
    addToast('warning', message, options)

  const info = (message: string, options?: ToastOptions) =>
    addToast('info', message, options)

  return {
    toasts: readonly(toasts),
    success,
    error,
    warning,
    info,
    removeToast,
    clearToasts
  }
}