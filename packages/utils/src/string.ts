/**
 * String manipulation utilities
 */

/**
 * Unescape HTML entities
 * @param html - HTML string to unescape
 * @returns Unescaped string
 */
export function unescapeHtml(html: string): string {
  if (!html) {
    return html
  }

  const escapeMap: Record<string, string> = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' '
  }

  return html.replace(/&lt;|&gt;|&amp;|&quot;|&#39;|&nbsp;/g, (match) => {
    return escapeMap[match]
  })
}

/**
 * Escape HTML entities
 * @param text - Text to escape
 * @returns Escaped HTML string
 */
export function escapeHtml(text: string): string {
  if (!text) {
    return text
  }

  const escapeMap: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;',
    ' ': '&nbsp;'
  }

  return text.replace(/[<>&'" ]/g, (match) => {
    return escapeMap[match]
  })
}

/**
 * Format phone number
 * @param phoneValue - Phone number to format
 * @param hide - Whether to hide middle digits
 * @param withPlus86 - Whether to include +86 prefix
 * @returns Formatted phone number
 */
export function formatPhone(phoneValue: string, hide = false, withPlus86 = false): string | undefined {
  if (!phoneValue) {
    return undefined
  }

  const prefix = withPlus86 ? '+86 ' : ''
  const pattern = hide ? prefix + '$1 **** $3' : prefix + '$1 $2 $3'
  
  return phoneValue
    .replace(/\D/g, '')
    .replace(/^(?:\+?86)?(\d{3})(\d{4})(\d{4})$/, pattern)
}