/*
 * 根据输入的毫秒数，输出对应的时分秒
 * remainingTime(12045000) => {hour: 3, minute: 20, second: 45}
*/
export const remainingTime = (rt) => {
  if (rt <= 0) {
    return {
      hour: 0,
      minute: 0,
      second: 0
    }
  }

  var hour = (rt | 0) / (3600 * 1000) | 0,
    minute = ((rt | 0) % (3600 * 1000)) / (60 * 1000) | 0,
    second = ((rt | 0) % (3600 * 1000) % (60 * 1000)) / 1000 | 0;
  
  return {
    hour: hour,
    minute: minute,
    second: second
  }
}