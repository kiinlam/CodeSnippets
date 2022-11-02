/**
 * 求某月份共有多少个周几
 * @param {number} totalDays 月份共有天数
 * @param {number} targetDay 目标日是周几
 * @param {number} startDay 月份起始日是周几
 * @returns number 共有多少个 targetDay
 */
function dayCount(totalDays, targetDay, startDay) {
  return Math.ceil((totalDays - ((7 + targetDay - startDay) % 7)) / 7)
}
