/**
 * URL manipulation utilities
 */

/**
 * Parse URL parameters
 * @param name - Parameter name to get (optional)
 * @param search - Search string to parse (optional, defaults to window.location.search if available)
 * @returns Parameter value or all parameters object
 */
export function parseUrlParams(name?: string, search?: string): string | Record<string, string> | null {
  const searchString = search || (typeof window !== 'undefined' ? window.location.search : '')
  
  if (!searchString) {
    return name ? null : {}
  }

  const params = new URLSearchParams(searchString)
  const obj: Record<string, string> = {}
  
  params.forEach((value, key) => {
    obj[key] = value
  })

  return name ? (obj[name] || null) : obj
}

/**
 * Convert object to query string
 * @param obj - Object to convert
 * @returns Query string
 */
export function objectToQueryString(obj: Record<string, any>): string {
  const queryParams: string[] = []

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined && obj[key] !== null) {
      const value = obj[key]
      const encodedKey = encodeURIComponent(key)
      const encodedValue = encodeURIComponent(String(value))
      queryParams.push(`${encodedKey}=${encodedValue}`)
    }
  }

  return queryParams.join('&')
}

/**
 * Check if string is a valid URL
 * @param urlString - String to validate
 * @returns True if valid URL, false otherwise
 */
export function isValidURL(urlString: string): boolean {
  const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/
  return pattern.test(urlString)
}

/**
 * Update URL parameters without page refresh (browser only)
 * @param params - Parameters to update
 * @param replace - Whether to replace all parameters (default: false)
 */
export function updateUrlParams(params: Record<string, any>, replace = false): void {
  if (typeof window === 'undefined' || typeof history === 'undefined') {
    console.warn('updateUrlParams can only be used in browser environment')
    return
  }

  const url = window.location.href
  const index = url.indexOf('?')
  
  let before = ''
  let existingParams: Record<string, any> = {}

  if (index === -1) {
    before = url
  } else {
    before = url.substring(0, index)
    const queryString = url.substring(index + 1)
    
    queryString.split('&').filter(Boolean).forEach(item => {
      const [key, value] = item.split('=')
      if (key && value) {
        if (existingParams[key]) {
          existingParams[key] = Array.isArray(existingParams[key]) 
            ? existingParams[key] 
            : [existingParams[key]]
          existingParams[key].push(decodeURIComponent(value))
        } else {
          existingParams[key] = decodeURIComponent(value)
        }
      }
    })
  }

  const newParams = replace ? { ...params } : { ...existingParams, ...params }
  const queryString = objectToQueryString(newParams)
  const newUrl = queryString ? `${before}?${queryString}` : before

  history.replaceState(null, '', newUrl)
}