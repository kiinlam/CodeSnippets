import { isEmpty } from './index'

/**
 * 构建新的表格列配置描述
 * @param {array} columns 表格列的配置描述
 * @param {object} ctxSlots v-slot模板
 * @returns {array} 更新后的表格列配置
 */
export default function updateColumns(columns: any[] = [], ctxSlots = {}) {
  const newColumns: any[] = []
  columns.forEach((col) => {
    const { slots = {}, ...restProps } = col
    const column = {
      ...restProps,
    }

    // handle v-slot
    Object.keys(slots).forEach((key) => {
      // key = 'customRender' | 'filterDropdown' | 'filterIcon' | 'title'
      // name is v-slot.name
      const name = slots[key]
      if (column[key] === undefined && ctxSlots[name]) {
        column[key] = ctxSlots[name]
      }
    })
    
    // `column.defaultText`: 数据为空时代替显示的内容
    // `column.emptyTest`: 配置是否需要检测，默认开启，可设为false关闭，或自定义规则
    // false | Function(text, record, index, column) => boolean
    if (column.emptyTest !== false) {
      const customRender = column.customRender
      let testFn = (typeof column.emptyTest === 'function') ? column.emptyTest : isEmpty
      column.customRender = function({ text, record, index, column }) {
        if (testFn(text, record, index, column)) {
          return column.defaultText || ''
        } else if (customRender) {
          return customRender({ text, record, index, column })
        } else {
          return text
        }
      }
    }

    if (col.children) {
      column.children = updateColumns(column.children, ctxSlots)
    }
    newColumns.push(column)
  })
  return newColumns
}