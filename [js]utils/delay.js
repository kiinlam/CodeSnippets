/**
 * 延迟指定时间，单位毫秒
 * @param {timeout} Milliseconds
 * @example
 * async function test() {
 *   var delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
 *   console.log(1)
 *   await delay(3000)
 *   console.log(2)
 * }
 * test()
 */
export const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
