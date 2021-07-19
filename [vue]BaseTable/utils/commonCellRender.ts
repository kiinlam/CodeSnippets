/**
 * 单元格渲染前的处理方法
 * @param {object} attrs 表格配置数据
 * @returns {string | function} 返回渲染结果
 * - 当`$props.transformCellText`未设置时，如果单元格为空内容，替换为显示字符串`-`
 * - 当`$props.transformCellText`设置为字符串时，如果单元格为空内容，替换为显示该字符串
 * - 当`$props.transformCellText`设置为函数时，将直接调用，
 * 如果单元格为空内容，第一参数的`text`属性为空字符串，
 * 否则`text`为`String` | `VNode`，
 * 第二参数为slots
 * 函数最终需要返回期望渲染的内容
 */
export default function commonCellRender(transformCellText, slots) {
  const type = typeof transformCellText
  if (type === 'string' || type === 'undefined') {
    return function({ text, column, record, index }) {
      if (text === '') {
        return transformCellText || '-'
      }
      return text
    }
  } else if (type === 'function') {
    return function (slotScope) {
      return transformCellText(slotScope, slots)
    }
  }
}
