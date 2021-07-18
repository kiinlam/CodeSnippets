<template>
  <div ref="tableWrapRef" class="base-table-wrapper" v-bind="props">
    <div class="base-table-container" :class="{'base-table-autofit': tableAttrs.autoFit}">
      <Table v-bind="tableAttrs" :scroll="scroll"></Table>
    </div>
  </div>
  <Pagination v-if="paginationConfig.total > 0" v-bind="paginationConfig" />
  <!-- 以下用于去除控制台非props继承提示 -->
  <template v-bind="attrs" v-show="false"></template>
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
  scroll?: any
  remote?: any
}>()

const emit = defineEmit(['remote:success', 'remote:error', 'remote:complete'])

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

  // 设置loading状态
  tableAttrs.loading = tableAttrs.loading || false

  // 关闭自带的分页组件
  tableAttrs.pagination = false

  // 构建列描述配置
  tableAttrs.columns = updateColumns(tableAttrs.columns, slots)

  // 添加序号列
  addIndexColumn(tableAttrs.addIndex, tableAttrs.columns, paginationConfig)

  // 数据渲染前拦截方法
  tableAttrs.transformCellText = commonCellRender(tableAttrs, slots)
  
  return tableAttrs
})

// 删除最后一条数据后翻页处理可通过此方法获取信息
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
const scroll = reactive({
  ...props.scroll,
})
if (tableAttrs.value.autoFit !== false) {
  tableAttrs.value.autoFit = true
  const { rect } = useDomRect(tableWrapRef)
  watch(
    rect,
    (val) => {
      // 55为表头的高度，300为表格最小高度
      scroll.y = Math.max(val.height - 55, 300)
    }
  )
}

// 远程异步请求处理
// if (props.remote) {
  function request() {
    tableAttrs.value.loading = true
    props.remote().then(res => {
      emit('remote:success', res)
    }).catch((e) => {
      emit('remote:error', e)
    }).finally(() => {
      tableAttrs.value.loading = false
      emit('remote:complete')
    })
  }
  // watchEffect(() => {
  watch(props.remote, request, // bug!
  {
    // onTrack(e) {
    //   console.log(e)
    //   debugger
    // },
    // onTrigger(e) {
    //   console.log(e)
    //   debugger
    // },
    flush: 'post'
  }
  )
// }

</script>

<style scoped>
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
</style>
