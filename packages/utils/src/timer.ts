/**
 * Timer utilities
 */

import type { TimerOptions } from './types'

/**
 * Create a countdown timer
 * @param options - Timer options
 * @returns Timer instance
 */
export function createCountdownTimer(options: TimerOptions): NodeJS.Timeout {
  const defaultOptions: Required<TimerOptions> = {
    startCallback: () => {},
    callback: () => {},
    endCallback: () => {},
    endTime: 60,
    timeInterval: 1
  }

  const opts = { ...defaultOptions, ...options }

  // Execute start callback
  if (typeof opts.startCallback === 'function') {
    opts.startCallback()
  }

  let timer: NodeJS.Timeout | undefined

  const interval = (): void => {
    timer = setTimeout(() => {
      interval()
      if (typeof opts.callback === 'function' && timer) {
        opts.callback(timer)
      }
    }, opts.timeInterval * 1000)
  }

  interval()

  // Clear timer after specified time
  setTimeout(() => {
    if (typeof opts.endCallback === 'function') {
      opts.endCallback()
    }
    if (timer) {
      clearTimeout(timer)
    }
  }, opts.endTime * 1000)

  return timer!
}
