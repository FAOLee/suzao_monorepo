declare module 'element-plus' {
  interface ElMessage {
    success(message: string): void
    error(message: string): void
    warning(message: string): void
    info(message: string): void
  }
}