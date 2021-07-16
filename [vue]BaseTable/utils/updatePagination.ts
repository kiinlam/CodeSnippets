/**
 * 构建分页配置
 * @param {array} columns 表格列的配置描述
 * @param {object} pagination 绑定的分页配置数据
 * @returns {object} 更新后的分页配置
 */
function updateConfig(config, page, pageSize) {
  config.current = page
  config.pageSize = pageSize
}
export default function updatePagination(pagination = {}, baseConfig) {
  // 默认配置
  const config = {
    current: baseConfig.current,
    pageSize: baseConfig.pageSize,
    pageSizeOptions:['10', '20', '50', '100', '200'],
    showQuickJumper: true,
    showSizeChanger: true,
    total: 0,
    showTotal(total) {
      return `共 ${total} 条`
    },
    update(val) {},
    onChange(page, pageSize) {
      updateConfig(baseConfig, page, pageSize)
    },
    onShowSizeChange(page, pageSize) {},
  }
  // 继承配置
  let handler
  for (let k in pagination) {
    if (k === 'onShowSizeChange') {
      console.warn('[onShowSizeChange]配置项不做处理，请统一使用[onChange]!!!')
    } else if (k === 'onChange') {
      handler = pagination[k]
    } else {
      config[k] = pagination[k]
    }
  }
  if (handler) {
    config.onChange = function (page, pageSize) {
      updateConfig(baseConfig, page, pageSize)
      handler(page, pageSize)
    }
  }
  config.onShowSizeChange = config.onChange
  // console.log('pagination:', config)
  return config
}