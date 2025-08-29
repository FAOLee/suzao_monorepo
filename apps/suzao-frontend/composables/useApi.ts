export const useApi = () => {
  const config = useRuntimeConfig()

  const fetchApi = async <T>(url: string, options?: any) => {
    return await $fetch<T>(url, {
      baseURL: config.public.apiBase,
      ...options
    })
  }

  return { fetchApi }
}
