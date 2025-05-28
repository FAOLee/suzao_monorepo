/**
 * 检查给定值是否为有效的Date对象
 * @param date - 要检查的值
 * @returns 如果是有效的Date对象返回true,否则返回false
 */
const isValidDate = (date: unknown): date is Date => {
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * 可接受的时间输入类型
 */
type TimeInput = string | number | Date

/**
 * 将时间转换为指定格式的字符串
 * @param time - 要格式化的时间,可以是字符串、数字或Date对象
 * @param cFormat - 格式化模板,默认为'{y}-{m}-{d} {h}:{i}:{s}'
 *                  支持的占位符:
 *                  {y}: 年份
 *                  {m}: 月份(1-12)
 *                  {d}: 日期(1-31)
 *                  {h}: 小时(0-23)
 *                  {i}: 分钟(0-59)
 *                  {s}: 秒钟(0-59)
 *                  {a}: 星期(日-六)
 * @returns 格式化后的时间字符串,如果输入无效则返回void并打印错误
 */
const parseTime = (time: TimeInput, cFormat = '{y}-{m}-{d} {h}:{i}:{s}'): string | void => {
  let date: Date
  if (isValidDate(new Date(time))) {
    date = new Date(time)
  } else if (typeof time === 'string') {
    date = new Date(time.replace(/-/g, '/'))
  } else {
    return console.error('非法time')
  }

  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }

  return cFormat.replace(/{(y|m|d|h|i|s|a)+}/g, (_, key: keyof typeof formatObj) => {
    const value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
}

/**
 * 将时间戳转换为对应日期当天开始或结束的时间戳
 * @param timestamp - 要进行转换的原始时间戳,通常可以通过Date.now()获取当前时间戳,
 *                    或者传入其他合法的表示时间的时间戳数值(单位为毫秒)
 * @param isEndOfDay - 一个可选的布尔值参数,用于指定转换的方式,默认值为false
 * @returns 返回经过转换后的时间戳数值(单位为毫秒),具体取决于isEndOfDay参数的设置情况
 */
const convertTimestamp = (timestamp: number, isEndOfDay: boolean = false): number => {
  // 根据传入的时间戳创建Date对象，以便后续对时间进行操作
  const date = new Date(timestamp)
  if (isEndOfDay) {
    // 获取Date对象中的年份、月份和日期信息
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    // 创建一个新的Date对象，表示当天的最后一刻（23:59:59）
    const endOfDayDate = new Date(year, month, day, 23, 59, 59)

    // 返回表示当天最后一刻的时间戳（毫秒）
    return endOfDayDate.getTime()
  }

  // 将Date对象重置为当天的0点0分0秒0毫秒
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)

  // 返回当天开始时间的时间戳（毫秒）
  return date.getTime()
}

export { parseTime, isValidDate, convertTimestamp }