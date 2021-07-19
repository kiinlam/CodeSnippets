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
* 组件导出 `request` 方法用于请求远程数据，支持emit事件回调或 `Promise.then` 处理响应数据

---

## API

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|------|
| addIndex | 是否在第一列位置添加序号列 | false \| column 列描述数据对象 | {...addIndex} 参见 `addIndex` 小节 |
| disableAutoFit | 是否禁用高度自适应 | true | - |
| columns | 在原来column配置项上增加了配置，参见 `column` 小节 | Column[] | [] |
| loading | 可选受控属性，是否显示加载中状态 | boolean \| Spin | false |
| pagination | 在原来pagination配置项上增加了配置，参见 `pagination` 小节 | object | 参见 `pagination` 小节 |
| remote | 指定远程api请求方法 | Promise | undefined |
| transformCellText | 单元格渲染之前的处理方法 | String \| Function(slotScope, slots) | 空值时：字符串"-" \| 原始渲染内容 |

---

## addIndex

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

可通过传入 `column` 描述对象进行配置

## column

---

## pagination

默认值：

```javascript
{
  current: 1,
  pageSize: 10,
  pageSizeOptions:['10', '20', '50', '100', '200'],
  showQuickJumper: true,
  showSizeChanger: true,
  total: 0,
  showTotal(total) {
    return `共 ${total} 条`
  },
  update(val) {},
  onChange(page, pageSize) {},
  onShowSizeChange(page, pageSize) {},
}
```

---

## remote

---

## transformCellText

---

## 组件暴露的方法

#### request

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