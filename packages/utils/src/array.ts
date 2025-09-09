/**
 * Array manipulation utilities
 */

/**
 * Remove empty values from array
 * @param array - Array to filter
 * @returns Array with empty values removed
 */
export function trimSpace<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item): item is T => {
    if (item === null || typeof item === 'undefined') {
      return false
    }
    if (typeof item === 'string' && item.trim() === '') {
      return false
    }
    return true
  })
}

/**
 * Check if value is within array range
 * @param value - Value to check
 * @param array - Array of numbers to check range
 * @returns True if value is within range, false otherwise
 */
export function isInRange(value: number, array: number[]): boolean {
  if (!Array.isArray(array) || array.length === 0) {
    return false
  }
  
  const minValue = Math.min(...array)
  const maxValue = Math.max(...array)
  
  return value >= minValue && value <= maxValue
}