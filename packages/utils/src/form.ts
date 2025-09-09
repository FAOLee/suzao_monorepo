/**
 * Form data utilities
 */

import type { FormDataObject } from './types'

/**
 * Convert object to FormData
 * @param data - Object to convert
 * @returns FormData instance
 */
export function parseFormData(data: FormDataObject): FormData {
  const formData = new FormData()
  
  for (const key in data) {
    const value = data[key]
    
    if (Array.isArray(value) && value.length > 0) {
      value.forEach((item) => {
        formData.append(`${key}[]`, String(item))
      })
    } else if (value !== undefined && value !== null) {
      formData.append(key, value instanceof File ? value : String(value))
    }
  }
  
  return formData
}