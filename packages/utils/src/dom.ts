/**
 * DOM manipulation utilities (browser only)
 */

import type { MouseOptions, ScrollOptions } from './types'

/**
 * Check if element has scrollbar
 * @param el - Element to check
 * @param direction - Direction to check ('vertical' or 'horizontal')
 * @returns True if has scrollbar
 */
export function hasScrolled(el: HTMLElement, direction: 'vertical' | 'horizontal' = 'vertical'): boolean {
  if (direction === 'vertical') {
    return el.scrollHeight > el.clientHeight
  } else {
    return el.scrollWidth > el.clientWidth
  }
}

/**
 * Scroll element into view
 * @param options - Scroll options
 * @param element - Element to scroll (default: document.body)
 */
export function scrollIntoView(options: ScrollOptions = {}, element?: HTMLElement): void {
  const defaultOptions = { behavior: 'auto' as const, block: 'start' as const, inline: 'nearest' as const }
  const scrollOptions = { ...defaultOptions, ...options }
  const targetElement = element || document.querySelector('body')
  
  if (targetElement) {
    targetElement.scrollIntoView(scrollOptions)
  }
}

/**
 * Check if page has scrollbar and add/remove class
 */
export function updateScrollbarClass(): void {
  if (typeof document === 'undefined') return
  
  const hasScrollbar = document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight)
  
  if (hasScrollbar) {
    document.body.classList.add('scrollbar')
  } else {
    document.body.classList.remove('scrollbar')
  }
}

/**
 * Add mouse event listeners to element
 * @param options - Mouse options
 */
export function addMouseListeners(options: MouseOptions): void {
  if (!options.element) {
    console.warn('Element is required for mouse listeners')
    return
  }

  const mouseReference = {
    buttonDown: false,
    x: false as number | false,
    y: false as number | false
  }

  function addEventListener(element: HTMLElement | Document, event: string, listener: (event: Event) => void): void {
    if ('addEventListener' in element) {
      element.addEventListener(event, listener, false)
    }
  }

  function mouseDown(event: Event): void {
    const mouseEvent = event as MouseEvent
    mouseReference.buttonDown = true
    mouseReference.x = mouseEvent.pageX
    mouseReference.y = mouseEvent.pageY
    
    if (typeof options.downCallback === 'function') {
      options.downCallback(mouseEvent, mouseReference)
    }
  }

  function mouseMove(event: Event): void {
    const mouseEvent = event as MouseEvent
    if (mouseEvent.buttons === 1 && mouseReference.buttonDown) {
      if (typeof options.moveCallback === 'function') {
        options.moveCallback(mouseEvent, mouseReference)
      }
    }
  }

  function mouseUp(event: Event): void {
    const mouseEvent = event as MouseEvent
    mouseReference.buttonDown = false
    
    if (typeof options.upCallback === 'function') {
      options.upCallback(mouseEvent, mouseReference)
    }
  }

  addEventListener(options.element, 'mousedown', mouseDown)
  addEventListener(options.element, 'dragstart', (event) => {
    event.preventDefault()
    return false
  })
  addEventListener(document, 'mousemove', mouseMove)
  addEventListener(document, 'mouseup', mouseUp)
}

/**
 * Dynamically insert CSS link
 * @param cssHref - CSS file URL
 */
export function insertCSS(cssHref: string): void {
  if (typeof document === 'undefined') return
  
  const id = cssHref.replace(/[\/.]/g, '')
  if (document.getElementById(id)) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.id = id
  link.href = cssHref
  document.head.appendChild(link)
}