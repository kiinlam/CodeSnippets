<template>
  <div ref="tableWrapRef" class="base-table-wrapper" :height="rect.height" v-bind="props">
    <div class="base-table-container">
      <Table v-bind="tableAttrs"></Table>
    </div>
  </div>
  <Pagination v-if="paginationConfig.total > 0" v-bind="paginationConfig" />
  <!-- 以下用于去除控制台非props继承提示 -->
  <template v-bind="attrs"></template>
</template>

<script lang="ts" setup>
import { computed, defineEmit, defineProps, reactive, ref, useContext, watch, watchEffect } from 'vue'
import { Table, Pagination } from 'ant-design-vue'
import { useDomRect } from './utils/useDomRect'
import resolveAttrs from './utils/resolveAttrs'
import updatePagination from './utils/updatePagination'
import updateColumns from './utils/updateColumns'
import addIndexColumn from './utils/addIndexColumn'
import commonCellRender from './utils/commonCellRender'

const props = defineProps<{
  class?: any
  id?: any
  style?: any
  pagination?: any
}>()

// 分页需要更新的数据
const basePagination = reactive({
  current: 1,
  pageSize: 10,
})
// 处理分页配置
const paginationConfig = computed(() => {
  return updatePagination(props.pagination, basePagination)
})

// 处理表格配置
const { attrs, slots } = useContext()
const tableAttrs = computed(() => {
  const tableAttrs = resolveAttrs(attrs)

  // 设置默认的row-key
  tableAttrs.rowKey = tableAttrs.rowKey || (row => (row.id || row.key))

  // 关闭自带的分页组件
  tableAttrs.pagination = false

  // 构建列描述配置
  tableAttrs.columns = updateColumns(tableAttrs.columns, slots)

  // 添加序号列
  addIndexColumn(tableAttrs.addIndex, tableAttrs.columns, paginationConfig)

  // 数据渲染前拦截方法
  tableAttrs.transformCellText = commonCellRender(tableAttrs)
  
  return tableAttrs
})

// 删除最后一条数据后翻页处理
// onlyOne: true | pageLastOne: true -> 最后一条记录
// onlyOne: false | pageLastOne: true -> 当前页最后一条记录
// onlyOne: false | pageLastOne: false -> 不是最后一条记录
watchEffect(
  () => {
    const count = tableAttrs.value.dataSource.length
    const { current, total, update } = paginationConfig.value
    let onlyOne = false
    let pageLastOne = false
    if (count === 1) {
      if ( current > 1) {
        pageLastOne = true
      }
      if (total === 1) {
        onlyOne = true
      }
    }
    update({ onlyOne, pageLastOne })
  }
)

// 表格高度自适应
const tableWrapRef = ref()
const { rect } = useDomRect(tableWrapRef)
</script>

<style scoped>
.base-table-wrapper {
  flex: 1;
  position: relative;
}
.base-table-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
}
</style>
