/**
 * 防抖函数
 * @param fn - 需要防抖的函数
 * @param delay - 防抖延迟时间，单位毫秒，默认为300
 * @returns 返回一个防抖后的函数
 */
const debounce = <T extends (...args: any[]) => void>(fn: T, delay = 300): (...args: Parameters<T>) => void => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * 节流函数
 * @param fn - 需要节流的函数
 * @param delay - 节流延迟时间，单位毫秒，默认为300
 * @returns 返回一个节流后的函数
 */
const throttle = <T extends (...args: any[]) => void>(fn: T, delay = 300): (...args: Parameters<T>) => void => {
  let lastTime = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime > delay) {
      lastTime = now;
      fn(...args);
    }
  }
}

/**
 * 深度克隆对象
 * @param obj - 需要克隆的对象
 * @returns 返回一个克隆后的对象
 */
const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  let copy: any = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    copy[key] = deepClone(obj[key]);
  }
  return copy;
}

export { debounce, throttle, deepClone }