<template>
  <div ref="tableWrapRef" class="base-table-wrapper" :id="id" :class="class" :style="style">
    <div class="base-table-container" :class="{'base-table-autofit': !disableAutoFit}">
      <Table
        v-bind="attrs"
        :dataSource="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="false"
        :rowKey="rowKey"
        :scroll="scroll"
        :transformCellText="transformCellText"
      ></Table>
    </div>
  </div>
  <Pagination
    v-if="paginationConfig.total > 0"
    v-bind="paginationConfig"
    class="pagination-wrapper"
  />
</template>

<script lang="ts" setup>
import { computed, defineEmit, defineProps, reactive, ref, toRef, useContext, watch, watchEffect } from 'vue'
import { Table, Pagination } from 'ant-design-vue'
import { useDomRect } from './utils/useDomRect'
import updateLoading from './utils/updateLoading'
import updatePagination from './utils/updatePagination'
import updateColumns from './utils/updateColumns'
import addIndexColumn from './utils/addIndexColumn'
import commonCellRender from './utils/commonCellRender'

const { attrs, slots, expose } = useContext()

const props = defineProps<{
  class?: any
  id?: any
  style?: any
  addIndex?: any
  dataSource?: any[]
  disableAutoFit?: boolean
  columns?: any[]
  loading?: any
  pagination?: any
  remote?: any
  rowKey?: any
  scroll?: any
  transformCellText?: any
}>()

const emit = defineEmit(['remote:success', 'remote:error', 'remote:complete'])

/**
 * loading
 * 受控属性，可选
 */
const innerLoading = reactive({
  spinning: false
})
const loading = computed(() => {
  return updateLoading(props.loading, innerLoading)
})

/**
 * row-key
 * 设置默认的row-key
 */
const rowKey = computed(() => {
  return props.rowKey || (row => (row.id || row.key))
})

/**
 * pagination
 * 处理分页配置
 */
// 组件内分页需要更新的数据
const innerPagination = reactive({
  current: 1,
  pageSize: 10,
})
// 处理分页配置
const paginationConfig = computed(() => {
  return updatePagination(props.pagination, innerPagination)
})

/**
 * column
 * 构建列描述配置
 */
const columns = computed(() => {
  const cols = updateColumns(props.columns, slots)
  addIndexColumn(props.addIndex, cols, paginationConfig)
  return cols
})

/**
 * transformCellText
 * 渲染前拦截
 */
const transformCellText = commonCellRender(props.transformCellText, slots)

/**
 * 表格高度自适应
 */
const tableWrapRef = ref()
const scroll = reactive({
  ...props.scroll,
})
if (!props.disableAutoFit) {
  const { rect } = useDomRect(tableWrapRef)
  // 表头的高度
  const head = {
    small: 39,
    large: 47,
    default: 55,
  }
  watch(
    rect,
    (val) => {
      // 300为表格最小高度
      scroll.y = Math.max(val.height - head[attrs.size || 'default'], 300)
    }
  )
}

/**
 * 删除最后一条数据后翻页处理可通过此方法获取 onlyOne | pageLastOne 信息
 * onlyOne: true | pageLastOne: true -> 最后一条记录
 * onlyOne: false | pageLastOne: true -> 当前页最后一条记录
 * onlyOne: false | pageLastOne: false -> 不是最后一条记录
 */
watchEffect(
  () => {
    const count = props.dataSource?.length
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

let request = (...args) => {
  return Promise.resolve(args)
}
if (props.remote) {
  request = (...args) => {
    return new Promise((resolve, reject) => {
      innerLoading.spinning = true
      props.remote(...args).then(res => {
        emit('remote:success', res)
        resolve(res)
      }).catch((e) => {
        emit('remote:error', e)
        reject(e)
      }).finally(() => {
        innerLoading.spinning = false
        emit('remote:complete')
      })
    })
  }
}
expose({
  request,
})

</script>

<style lang="less" scoped>
.base-table-wrapper {
  flex: 1;
  position: relative;
}
.base-table-autofit {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
}
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: @gap-large;
}
</style>
