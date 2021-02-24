function pad(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}

// Date 对象输出 ISO 时间串
// toISOString() 方法返回一个 ISO（ISO 8601 Extended Format）格式的字符串： YYYY-MM-DDTHH:mm:ss.sssZ。时区总是UTC（协调世界时），加一个后缀“Z”标识。
// 该方法在ECMA-262第5版中被标准化。对于那些不支持此方法的JS引擎可以通过加上下面的代码实现
Date.prototype.toISOString = function () {
  return this.getUTCFullYear() +
    '-' + pad(this.getUTCMonth() + 1) +
    '-' + pad(this.getUTCDate()) +
    'T' + pad(this.getUTCHours()) +
    ':' + pad(this.getUTCMinutes()) +
    ':' + pad(this.getUTCSeconds()) +
    '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
    'Z';
};

// 常见需求，从Date对象输出本地时间 YYYY-MM-DD HH:mm:ss 格式字符串
export const toDateTimeString = (date) => {
  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    ' ' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds());
}

/**
 * 将 Date 转化为指定格式的String
 * @param {date} date
 * @param {string} fmt
 * @returns {string}
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * "yyyy-MM-dd hh:mm:ss.S"   ==> 2006-07-02 08:09:04.423
 * "yyyy-MM-dd E HH:mm:ss"   ==> 2009-03-10 二 20:09:04
 * "yyyy-MM-dd EE hh:mm:ss"  ==> 2009-03-10 周二 08:09:04
 * "yyyy-MM-dd EEE hh:mm:ss" ==> 2009-03-10 星期二 08:09:04
 * "yyyy-M-d h:m:s.S"        ==> 2006-7-2 8:9:4.18
 */
export const formatDate = (date, fmt) => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  const week = {
    0: '日',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '星期' : '周') : '') + week[date.getDay() + ''])
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? o[k] : pad(o[k]))
    }
  }
  return fmt
}

/**
 * 秒格成化成 HH:mm
 * @param {*} seconds
 * @example 1234.5678 => 20:34
 */
export const formatSecond = (time = 0) => {
  const second = Math.floor(time)
  const mm = Math.floor(second / 60)
  const ss = second % 60
  return pad(mm) + ':' + pad(ss)
}