/*
 * 限定一个数只能在某个范围内，不能超出
*/
export const astrictNum = (num, min, max) => {
  return Math.min(max, Math.max(min, num))
}