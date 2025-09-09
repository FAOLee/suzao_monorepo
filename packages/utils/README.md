# @suzao/utils

A comprehensive TypeScript utilities library for common operations.

## Features

- **Type-safe**: Full TypeScript support with proper type definitions
- **Modular**: Import only what you need
- **Tree-shakeable**: Optimized for modern bundlers
- **Browser/Node compatible**: Works in both environments where applicable

## Installation

```bash
npm install @suzao/utils
```

## Usage

```typescript
// Import specific utilities
import { deepClone, parseTime, debounce } from '@suzao/utils'

// Or import from specific modules
import { deepClone } from '@suzao/utils/object'
import { parseTime } from '@suzao/utils/date'
```

## Modules

### Object Utilities (`object`)
- `deepClone<T>(source: T): T` - Deep clone objects and arrays
- `objectToQueryString(obj: Record<string, any>): string` - Convert object to query string
- `arrayToObjectByKey<T>(array: T[], key: keyof T): Record<string, T[]>` - Group array by key
- `isEmpty(value: any): boolean` - Check if value is empty

### Array Utilities (`array`)
- `trimSpace<T>(array: (T | null | undefined)[]): T[]` - Remove empty values
- `isInRange(value: number, array: number[]): boolean` - Check if value is in array range

### Date Utilities (`date`)
- `isValidDate(date: any): date is Date` - Validate date objects
- `parseTime(time: Date | string | number, format?: string): string | null` - Format dates
- `convertTimestamp(timestamp: number, isEndOfDay?: boolean): number` - Convert to day boundaries
- `toTimestamp(time?: Date | string | number): number` - Convert to timestamp

### String Utilities (`string`)
- `unescapeHtml(html: string): string` - Unescape HTML entities
- `escapeHtml(text: string): string` - Escape HTML entities
- `formatPhone(phoneValue: string, hide?: boolean, withPlus86?: boolean): string` - Format phone numbers

### URL Utilities (`url`)
- `parseUrlParams(name?: string, search?: string): string | Record<string, string> | null` - Parse URL parameters
- `isValidURL(urlString: string): boolean` - Validate URLs
- `updateUrlParams(params: Record<string, any>, replace?: boolean): void` - Update URL without refresh

### Device Detection (`device`)
- `isWeChat(userAgent?: string): boolean` - Detect WeChat browser
- `isPC(platform?: string): boolean` - Detect PC platform
- `getUserAgent(userAgent?: string, platform?: string): UserAgent` - Get device type
- `getBrowser(userAgent?: string): Browser` - Get browser type

### Storage Utilities (`storage`)
- `setStorage(key: string, value: any, expire?: Date | number | string): void` - Set with expiration
- `getStorage(key: string): any` - Get with expiration check

### Timer Utilities (`timer`)
- `createCountdownTimer(options: TimerOptions): NodeJS.Timeout` - Create countdown timer
- `debounce<T>(func: T, wait?: number, immediate?: boolean): Function` - Debounce function calls

### Form Utilities (`form`)
- `parseFormData(data: FormDataObject): FormData` - Convert object to FormData

### DOM Utilities (`dom`) - Browser only
- `hasScrolled(el: HTMLElement, direction?: 'vertical' | 'horizontal'): boolean` - Check scrollbar
- `scrollIntoView(options?: ScrollOptions, element?: HTMLElement): void` - Scroll element into view
- `updateScrollbarClass(): void` - Update scrollbar CSS class
- `addMouseListeners(options: MouseOptions): void` - Add mouse event listeners
- `insertCSS(cssHref: string): void` - Dynamically insert CSS

### Crypto Utilities (`crypto`)
- `calculateFileMD5(file: File): Promise<{fileMd5: string, rcFile: File}>` - Calculate file MD5 hash

## License

MIT