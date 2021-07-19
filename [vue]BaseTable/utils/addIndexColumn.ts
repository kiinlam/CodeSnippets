import { isValueNil } from './index'

/**
 * 表格列配置添加序号列
 * addIndex 未设置时，默认为开启，设为 false 可取消
 * @param {boolean | object} addIndex 表格列column的配置描述对象
 * @param {array} columns 表格列的配置描述数组
 * @param {object} pagination 分页配置
 */
export default function addIndexColumn(addIndex, columns, pagination: any) {
  const indexColumn = isValueNil(addIndex) ? {} : addIndex
  if (import.meta.env.VITE_APP_MODE !== 'prod') {
    if (indexColumn && typeof indexColumn !== 'object') {
      throw new Error('[addIndex]配置项不是Object!!!')
    }
  }
  if (indexColumn) {
    columns.unshift({
      title: '序号',
      key: 'dataindex',
      width: 80,
      customRender({ text, record, index, column }) {
        return index + 1 + (pagination.value.current - 1) * pagination.value.pageSize
      },
      ...indexColumn,
    })
  }
}