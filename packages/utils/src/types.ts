/**
 * Type definitions for utils library
 */

export interface FormDataObject {
  [key: string]: string | number | File | Array<string | number | File>
}

export interface TimerOptions {
  startCallback?: () => void
  callback?: (timer: NodeJS.Timeout) => void
  endCallback?: () => void
  endTime?: number
  timeInterval?: number
}

export interface MouseOptions {
  element?: HTMLElement
  moveCallback?: (event: MouseEvent, reference: MouseReference) => void
  downCallback?: (event: MouseEvent, reference: MouseReference) => void
  upCallback?: (event: MouseEvent, reference: MouseReference) => void
}

export interface MouseReference {
  buttonDown: boolean
  x: number | false
  y: number | false
}

export interface ScrollOptions {
  behavior?: ScrollBehavior
  block?: ScrollLogicalPosition
  inline?: ScrollLogicalPosition
}

export interface StorageData {
  data: any
  expire: number | null
}

export type UserAgent = 'PC' | 'apple' | 'android' | 'harmonyos' | 'others'
export type Browser = 'ie' | 'ie9' | 'edge' | 'chrome' | 'ff' | undefined