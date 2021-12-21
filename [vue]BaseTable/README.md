# BaseTable

---

## 简介

根据业务需求，基于 ant design vue v2.1.2 `Table` 组件进行二次封装，将公用配置设置为默认值，达到降低编码复杂度，提升开发效率，便于维护的目标。

---

## 特性

* 自动在`columns`配置项开头添加序号列，可通过配置关闭
* 自动根据父级Dom元素高度调整 `Table` 组件高度，实现高度自适应功能，可通过配置关闭
* 单元格内容为空时，可配置替换内容，支持 String | Function | V-Slot
* 自动添加分页组件，并在内部管理分页选项，也可通过 `prop` 进行受控管理
* 自动配置 `rowKey` 选项，优先采用 `id`，其次是 `key`，也可通过 `prop` 传入
* 配置远程数据加载方法后，可自动设置 `loading` 状态，支持 Boolean | Spin 配置
* 组件导出 `jumpBy` 方法用于设置翻页前进后退
* 组件导出 `request` 方法用于请求远程数据，支持emit事件回调或 `Promise.then` 处理响应数据
* 组件导出 `setLoading` 方法用于设置加载中状态
* 组件导出 `setPage` 方法用于设置组件内部维护的分页选项

---

## API

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|------|
| addIndex | 新增配置，是否在第一列位置添加序号列 | false \| column 列描述数据对象 | {...addIndex} 参见 `addIndex` 小节 |
| disableAutoFit | 新增配置，是否禁用高度自适应 | true | - |
| columns | 在原来column配置项上增加了配置，参见 `column` 小节 | Column[] | [] |
| loading | 可选受控属性，是否显示加载中状态 | boolean \| Spin | false |
| pagination | 在原来pagination配置项上增加了配置，参见 `pagination` 小节 | object | 参见 `pagination` 小节 |
| hidePagination | 隐藏分页Dom节点，功能不影响 | boolean | undefined |
| remote | 新增配置，指定远程api请求方法 | Promise | undefined |
| transformCellText | 单元格渲染之前的处理方法 | String \| Function(slotScope, slots) | 空值时：字符串"-" \| 原始渲染内容 |

---

## addIndex

配置表格第一列是否添加序号列，默认为添加

默认值为：

```javascript
{
  title: '序号',
  key: 'dataindex',
  width: 80,
  customRender({ text, record, index, column }) {
    return index + 1 + (pagination.value.current - 1) * pagination.value.pageSize
  }
}
```

设置为`false`时不添加

可通过传入 `column` 描述对象进行配置

---

## disableAutoFit

禁用高度自适应，默认为开启高度自适应功能，要求父元素样式设置为`display:flex; flex-direction: column;`，表格高度最小值为300

---

## column

表格列描述对象，参见[Column](https://2x.antdv.com/components/table-cn#API)

增加两个配置项：

```javascript
{
  emptyTest: false | Function(text, record, index, column) => boolean
  defaultRender: v-slot ｜ Function(slotScope) => (V-Slot | String)
}
```

#### emptyTest

用于测试当前列的单元格内容是否为空数据，当检测结果为`true`时，替换为空字符串，替换方法可通过`defaultRender`配置项自定义

默认将以下情况视为空数据：

```javascript
"" | null | undefined | isNaN | [] | {}
```

可通过传入返回布尔值的函数进行自定义检测条件，如：

```javascript
emptyTest(text, record, index, column) {
  return text === '无' // 如果当前记录指定的属性值为字符串“无”，则视为空数据
}
```

配置为`false`时，不做检测

#### defaultRender

当`emptyTest`测试结果返回`true`时，对替换内容进行自定义设置

使用方法：

```javascript
// 通过函数自定义
defaultRender({text, record, index, column}) {
  return '-/-' // 空数据的单元格将被替换为 “-/-”
}
```

或

```html
// 通过v-slot自定义
// 当record.tag为空数据时，替换为一个按钮
<template>
  <BaseTable :columns="columns" :dataSource="data">
    <template #tagDefaultRender>
      <button>add tag</button>
    </template>
  </BaseTable>
</template>

<script>
  const columns = [
    {
      title: '标签',
      dataIndex: 'tag',
      slot: {
        defaultRender: 'tagDefaultRender' // 配置自定义slot渲染单元格内容
      }
    }
  ]
  const data = [
    {
      tag: []
    }
  ]
</script>
```

---

## loading

当设置了`remote`配置项后，通过组件暴露的`request 方法`发起请求时，组件内部会相应的变更`loading`状态，父组件无需控制

父组件也可以通过数据绑定对`loading`进行受控管理

```html
<template>
  <BaseTable :loading="loading" />
  <button @click="loadData">加载数据</button>
</template>

<script>
const loading = false
function loadData() {
  loading = true
}
</script>
```

`loading`选项也可以传入对象，支持`Spin`组件的配置项，参见[Spin](https://2x.antdv.com/components/spin-cn)

当不做数据绑定，又确实需要设置加载状态时，可通过组件暴露的`setLoading`方法进行设置，参见`setLoading 方法`小节

---

## pagination

基于[分页组件](https://2x.antdv.com/components/pagination-cn/#API)做了扩展

`BaseTable`组件默认禁用了Table自带的分页组件，单独加入分页组件在表格下方，并设置了统一样式

分页组件默认值为：

```javascript
{
  current: 1,
  pageSize: 10,
  pageSizeOptions:['10', '20', '50', '100', '200'],
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal(total) {
    return `共 ${total} 条`
  },
  update(val) {},
  onChange(page, pageSize) {},
  onShowSizeChange(page, pageSize) {}, // 此项无需配置
}
```

其中，`current`、`pageSize`、`total`三个配置，组件内部会自行管理

父组件可通过`onChange`配置项获取当前分页、分页大小信息

```html
<template>
  <BaseTable :pagination="pagination" />
</template>

<script>
import { getFileList } from '@/api/index'
const pagination = {
  onChange(page, pageSize) {
    console.log('当前页：', page)
    console.log('分页大小：', pageSize)
    getFileList({page: page, size: pageSize})
  }
}
</script>
```

也可通过数据绑定进行受控管理

```html
<template>
  <BaseTable :pagination="pagination" />
</template>

<script>
const pagination = {
  current: 1,
  pageSize: 20,
  total: 100,
  // 统一通过onChange返回当前页码、分页大小
  onChange(page, pageSize) {
    pagination.current = page
    pagination.pageSize = pageSize
  }
}
</script>
```

当页数`current`切换时，执行父组件传入的`onChange(page, pageSize)`方法

当分页大小`pageSize`切换时，将当前页重置为`1`，然后执行`onChange(page, pageSize)`方法

当父组件提供`remote`配置项时，组件内会尝试从接口返回的数据中提取`total`数据进行维护

父组件也可通过数据绑定配置`total`选项进行管理

当不做数据绑定，又确实需要设置当前分页、分页大小、数据总数时，可通过组件暴露的`setPage`方法进行设置，参见`setPage 方法`小节

#### update 方法选项

新增配置

`update({ onlyOne, pageLastOne, onlyOnePage })`

为了方便父组件判断列表数据是否为最后一行数据，组件内部做了判断，并调用传入的`update`方法返回给父组件

onlyOne：表示当前总数据剩余最后一条

pageLastOne：表示当前数据为当前页的最后一条

组合起来可以区分三种情况：

* onlyOnePage: true -> 仅剩最后一页
* onlyOne: true | pageLastOne: true -> 总数据最后一条记录
* onlyOne: false | pageLastOne: true -> 当前页最后一条记录，但不是总数据最后一条
* onlyOne: false | pageLastOne: false -> 既不是最后一条记录，也不是当前页最后一条

```html
<template>
</template>

<script>
const baseTableRef = ref()
const dataSource = [...dataSource]
const pagination = {
  onlyOne: false, // 最后一条记录，可选
  pageLastOne: false, // 当前页最后一条记录，可选
  update({ onlyOne, pageLastOne, onlyOnePage }) {
    pagination.onlyOne = onlyOne
    pagination.pageLastOne = pageLastOne
  }
}
function del(ids) {
  delFileById(ids).then(res => {
    if (pagination.pageLastOne || (!pagination.onlyOnePage && ids.length === dataSource.length )) {
      // 当前页最后一条数据即将被删除，此时需要后退一页
      baseTableRef.value.jumpBy(-1)
    } else {
      baseTableRef.value.request()
    }
  })
}
</script>
```

---

## remote

为了实现加载状态的内部管理，需要通过`remote`配置项，传入一个返回`Promise`方法的函数，该函数由组件暴露的`request 方法`进行调用，请求结果有两种方式反馈给父组件，参见`request 方法`小节

```html
<template>
  <BaseTable
    ref="baseTableRef"
    :remote="getFile" />
</template>

<script>
import { getFileById } from '@/api/index'
const baseTableRef = ref()

// 通过remote设置的方法将在组件内被调用
function getFile() {
  id += 1
  return getFileById(id)
}

function send() {
  // request 方法接收任意参数，在组件内部会传给remote指定的方法，即上面定义的getFile方法
  baseTableRef.value.request().then(res => {
    console.log(res)
  })
}

onMounted(() => {
  send()
})
</script>
```

---

## transformCellText

单元格数据渲染前可以再次改变，一般用来设置空数据的默认内容，在原Table组件选项的基础上加入了`slots`参数

Function({ text, column, record, index }, slots) => any

该选项未指定时，默认设置了空数据返回字符串`-`

```javascript
if (text === '') { // 此处空字符判断，依据是column配置项默认空数据返回空字符
  return transformCellText || '-'
}
```

`text`属性值分三种

1. 空字符串，或`column`描述对象中`defaultRender`返回的值，此时表示该单元格是空数据
2. 其他字符串，即`record[dataIndex]`取得的值
3. vNode，设置了`slot`后会得到vNode类型

`transformCellText`指定的方法需要返回值才能渲染单元格数据，增加的`slots`参数可以方便使用模板来创建渲染内容

```html
<template>
  <BaseTable
    :transformCellText="finalRender"
  >
    <template #cellRender="{ text, column, record, index }">
      {{ index + text }}
    </template>
  </BaseTable>
</template>

<script>
function finalRender(slotScope, slots) {
  // 空数据时，返回slot进行渲染
  if (text === '') {
    return slots.cellRender()
  }
  // 非空数据，返回原渲染的内容
  return text
}
</script>
```

---

## 组件暴露的方法

#### request 方法

`BaseTable` 对外暴露 `request` 方法，用于执行 `remote` 选项传入的请求方法。

`request` 方法内部管理 `loading` 状态。

外部如需管理 `loading` 状态，可通过 `:loading = "loading` 改为受控属性。

`request` 支持出入任意参数，传入的参数目前未做处理，直接传给 `remote` 指定的方法。

```javascript
// request方法实现细节
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
```

#### 使用方法--通过Promise链式调用
```html
// 通过Promise链式调用
<template>
  <button @click="send">请求数据</button>
  <BaseTable ref="baseTableRef" :remote="getData" />
</template>

<script>
  // 创建引用，用于访问组件保留的 request 方法
  const baseTableRef = ref()

  // getData 方法将在组件的 request 方法内执行，一般从 api 模块导入，无需单独调用
  const getData = (data = {}) => { // 参数 data 从 request 方法传入
    console.log(data)
    return axios(data) // 必须返回Promise
  }

  function send() {
    // 接口需要接收的数据可在此处传入
    baseTableRef.value.request(payload).then(res => {
      console.log(res)
    }).catch(e => {
      console.log(e)
    })
  }
</script>
```

#### 使用方法--通过emit事件回调
```html
// 通过emit事件回调
<template>
  <button @click="send">请求数据</button>
  <BaseTable
    ref="baseTableRef"
    :remote="getData"
    @remote:success="onSuccess"
    @remote:error="onError"
    @remote:complete="onComplete"
  />
</template>

<script>
  // 创建引用，用于访问组件保留的 request 方法
  const baseTableRef = ref()

  // getData 方法将在组件的 request 方法内执行，一般从 api 模块导入，无需单独调用
  const getData = (payload = {}) => { // 参数 payload 从 request 方法传入
    console.log(payload)
    return axios(payload) // 必须返回Promise
  }

  function send() {
    baseTableRef.value.request(payload)
  }

  function onSuccess(res) {
    console.log(res)
  }

  function onError(e) {
    console.log(e)
  }

  function onComplete() {
    console.log('onComplete)
  }
</script>
```

注：

当 `remote` 选项未设置时，`request` 方法直接返回 Promise.resolve

```javascript
request = (...args) => {
  return Promise.resolve(args)
}
```

#### setLoading 方法

setLoading(isLoading: boolean): void

通过命令式调用控制加载状态

```html
<template>
  <BaseTable ref="baseTableRef" />
</template>

<script>
const baseTableRef = ref()

onMounted(() => {
  baseTableRef.value.setLoading(true)
})
</script>
```

---

#### setPage 方法

setPage(pageData: {current?: number, pageSize?: number, total?: number}, forceChange?: boolean): void

通过命令式调用控制分页组件，设置成功后，会调用分页配置的`onChange`方法

```html
<template>
  <BaseTable ref="baseTableRef" />
</template>

<script>
const baseTableRef = ref()

onMounted(() => {
  baseTableRef.value.setPage({current: 2, pageSize: 40, total: 100})
})
</script>
```

---

#### jumpBy 方法

jumpBy(count: number): void

通过命令式调用控制分页组件跳转页码，设置成功后，会调用分页配置的`onChange`方法

```html
<template>
  <BaseTable ref="baseTableRef" />
</template>

<script>
const baseTableRef = ref()

onMounted(() => {
  // 后退一页
  baseTableRef.value.jumpBy(-1)
})
</script>
```