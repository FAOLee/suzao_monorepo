/**
 * Object manipulation utilities
 */

/**
 * Deep clone an object or array
 * @param source - The object or array to clone
 * @returns The cloned object or array
 */
export function deepClone<T>(source: T): T {
  if (!source || typeof source !== 'object') {
    throw new Error('Invalid arguments for deepClone')
  }

  if (source instanceof Date) {
    return new Date(source.getTime()) as T
  }

  if (source instanceof Array) {
    const newArray: any[] = []
    for (let i = 0; i < source.length; i++) {
      if (source[i] && typeof source[i] === 'object') {
        newArray[i] = deepClone(source[i])
      } else {
        newArray[i] = source[i]
      }
    }
    return newArray as T
  }

  const newSource = {} as T
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key]
      if (value && typeof value === 'object') {
        newSource[key] = deepClone(value)
      } else {
        newSource[key] = value
      }
    }
  }
  return newSource
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
 * Convert array to object grouped by key
 * @param array - Array to convert
 * @param key - Key to group by
 * @returns Object with arrays grouped by key
 */
export function arrayToObjectByKey<T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> {
  if (!Array.isArray(array) || typeof key !== 'string') {
    return {}
  }

  return array.reduce((accumulator, current) => {
    if (current && typeof current === 'object' && current[key] !== undefined) {
      const currentKey = String(current[key])
      if (!accumulator[currentKey]) {
        accumulator[currentKey] = []
      }
      accumulator[currentKey].push(current)
    }
    return accumulator
  }, {} as Record<string, T[]>)
}

/**
 * Check if value is null, undefined, or empty
 * @param value - Value to check
 * @returns True if value is empty, false otherwise
 */
export function isEmpty(value: any): boolean {
  if (value === undefined || value === null) {
    return true
  }

  if (typeof value === 'string' && value.trim() === '') {
    return true
  }

  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true
  }

  if (Array.isArray(value) && value.length === 0) {
    return true
  }

  return false
}