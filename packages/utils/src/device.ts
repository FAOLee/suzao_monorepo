/**
 * Device detection utilities
 */

import type { UserAgent, Browser } from './types'

/**
 * Check if current device is WeChat browser
 * @param userAgent - User agent string (optional)
 * @returns True if WeChat browser
 */
export function isWeChat(userAgent?: string): boolean {
  const ua = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '')
  return ua.toLowerCase().includes('micromessenger')
}

/**
 * Check if current device is PC
 * @param platform - Platform string (optional)
 * @returns True if PC
 */
export function isPC(platform?: string): boolean {
  const platformString = platform || (typeof navigator !== 'undefined' ? navigator.platform : '')
  return platformString.indexOf('Win32') > -1
}

/**
 * Get user agent type
 * @param userAgent - User agent string (optional)
 * @param platform - Platform string (optional)
 * @returns User agent type
 */
export function getUserAgent(userAgent?: string, platform?: string): UserAgent {
  const sUserAgent = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '')
  const sPlatform = platform || (typeof navigator !== 'undefined' ? navigator.platform.toLowerCase() : '')

  const isMac = sPlatform.includes('mac') || sUserAgent.includes('macintosh')
  const isWin = sUserAgent.indexOf('windows nt') > -1
  
  if (isWin || isMac) return 'PC'
  
  const isIPad = sUserAgent.indexOf('ipad') > -1
  const isIPod = sUserAgent.indexOf('ipod') > -1
  const isIOS = sUserAgent.indexOf('iphone') > -1
  
  if (isIPad || isIPod || isIOS) return 'apple'
  if (sUserAgent.indexOf('android') > -1) return 'android'
  if (/HarmonyOS/i.test(sUserAgent)) return 'harmonyos'
  
  return 'others'
}

/**
 * Get browser type
 * @param userAgent - User agent string (optional)
 * @returns Browser type
 */
export function getBrowser(userAgent?: string): Browser {
  const inBrowser = typeof window !== 'undefined'
  const UA = userAgent || (inBrowser && window.navigator?.userAgent?.toLowerCase()) || ''
  
  if (!UA) return undefined
  
  if (/msie|trident/.test(UA)) return 'ie'
  if (UA.indexOf('msie 9.0') > 0) return 'ie9'
  if (UA.indexOf('edge/') > 0) return 'edge'
  if (/chrome\/\d+/.test(UA)) return 'chrome'
  if (UA.match(/firefox\/(\d+)/)) return 'ff'
  
  return undefined
}