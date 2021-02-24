/* toString(radix)
 * 任意数值转为指定进制
 * 0x6600.toString(2) // "110011000000000"
 *
 * parseInt(value, radix)
 * 将value作为指定进制radix来解析，得到10进制结果
 * parseInt("110011000000000", 2) // 26112
 *
 * 任意进制相互转换
 * 先转10进制，再换成目标进制
 * parseInt('ff', 16).toString(2) // "11111111"
*/
export const convertRadix = (numberString, from, to) => {
  return parseInt(numberString, from).toString(to)
}
