<template>
  <div ref="tableWrapRef" class="base-table-wrapper" :height="rect.height" v-bind="newAttrs.rootAttrs">
    <div class="base-table-container">
      <Table v-bind="newAttrs.tableAttrs"></Table>
    </div>
  </div>
  <Pagination v-bind="newAttrs.pagination" />
</template>

<script lang="ts" setup>
import { computed, ref, useContext } from 'vue'
import { Table, Pagination } from 'ant-design-vue'
import { useDomRect } from './utils/useDomRect'
import resolveAttrs from './utils/resolveAttrs'
import updateColumns from './utils/updateColumns'
import commonCellRender from './utils/commonCellRender'

const { attrs, slots } = useContext()
const newAttrs = computed(() => {
  const { rootAttrs, tableAttrs } = resolveAttrs(attrs)

  // 抽离pagination配置
  const pagination = {
    ...tableAttrs.pagination,
  }
  tableAttrs.pagination = false

  // 设置默认的row-key
  tableAttrs.rowKey = tableAttrs.rowKey || (row => (row.id || row.key))
  tableAttrs.columns = updateColumns(tableAttrs.columns, slots)
  tableAttrs.transformCellText = commonCellRender(tableAttrs)
  console.log(tableAttrs)
  return {
    tableAttrs,
    rootAttrs,
    pagination,
  }
})

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
