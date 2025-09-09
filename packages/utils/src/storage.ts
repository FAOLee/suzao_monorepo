/**
 * Storage utilities (browser only)
 */

import type { StorageData } from './types'
import { isValidDate } from './date'

/**
 * Set localStorage with expiration
 * @param key - Storage key
 * @param value - Value to store
 * @param expire - Expiration date/timestamp
 */
export function setStorage(key: string, value: any, expire?: Date | number | string): void {
  if (typeof localStorage === 'undefined') {
    console.warn('localStorage is not available')
    return
  }

  const obj: StorageData = {
    data: value,
    expire: null
  }

  if (expire !== undefined) {
    if (isValidDate(new Date(expire))) {
      obj.expire = new Date(expire).getTime()
    } else if (typeof expire === 'number' && !isNaN(expire)) {
      obj.expire = expire
    } else if (typeof expire === 'string') {
      const timestamp = Date.parse(expire)
      if (!isNaN(timestamp)) {
        obj.expire = timestamp
      }
    }
  }

  localStorage.setItem(key, JSON.stringify(obj))
}

/**
 * Get localStorage with expiration check
 * @param key - Storage key
 * @returns Stored value or null if expired/not found
 */
export function getStorage(key: string): any {
  if (typeof localStorage === 'undefined') {
    console.warn('localStorage is not available')
    return null
  }

  const val = localStorage.getItem(key)
  if (!val) return null

  try {
    const parsedVal: StorageData = JSON.parse(val)
    
    // Check expiration
    if (parsedVal.expire && Date.now() >= parsedVal.expire) {
      localStorage.removeItem(key)
      return null
    }

    return parsedVal.data
  } catch (error) {
    console.error('Error parsing stored data:', error)
    return null
  }
}