/*
 * 将数值改为千分位分隔，保留小数部分
 * thousandfy('24426295.93') // => 24,426,295.93
*/
export const thousandfy = (value) => {
  let re = /\d{1,3}(?=(\d{3})+$)/g;
  return String(value).replace(/^(\d+)((\.\d+)?)$/, (s, s1, s2) => s1.replace(re, "$&,") + s2)
}