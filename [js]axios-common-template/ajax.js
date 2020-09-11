/**
  # 功能
  - 支持请求管理，在config参数里设置mode属性
    * replace: 默认值，将会取消前一次相同请求，重新发起新的请求，相同请求的判断依据为`${config.method}@${config.url}`
    * repeat: 允许重复发起相同请求，适合并发请求
    * block: 阻塞，只要前一次相同请求没结束，新的请求就不能发起
  
  # 如何使用
  ajax 用于获取服务端返回的业务处理结果
  request 用于获取原始的请求相关数据
  ```
  import request, { ajax } from 'ajax'
  ajax(config)
  request.request(config)
  request.get(url[, config])
  request.delete(url[, config])
  request.head(url[, config])
  request.options(url[, config])
  request.post(url[, data[, config]])
  request.put(url[, data[, config]])
  request.patch(url[, data[, config]])
  ```
*/

import axios from 'axios'
import { getToken, removeToken } from '@/api/auth/utils'
import { message, notification } from 'ant-design-vue'

/**
 * 休眠一段时间
 * @param {Number} timeout 时长，单位毫秒
 * eg1: sleep(1000).then(()=>console.log('sleep'))
 * eg2: await sleep(1000); console.log('sleep')
 */
const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout))

/**
 * 数据配置，可自定义
 */
const messageField = 'message'
const errorCodeField = 'status_code'
const dataField = 'data'
const ERROR_MSG = {
  '-1': '未知错误',
  90001: '网络错误', // Network Error
  90002: '请求超时', // timeout
  90003: '请求取消' // Cancel
}
const messageDuration = 2.5
const notificationDuration = 10

/**
 * feedbackHandler
 * @param {Object} res 响应体，或Error实例
 */
const feedbackHandler = function (res) {
  const defaultFeedback = !!res.data[errorCodeField] || !res.response // 成功默认不显示反馈，失败默认显示
  // feedback: 是否显示反馈，也可在后续的业务处理回调函数里自定义反馈
  const { feedback = defaultFeedback } = res.config

  feedback && showFeedback(res)
}

/**
 * showFeedback
 * @param {Object} res 响应体，或Error实例
 */
const showFeedback = function (res) {
  const code = res.data[errorCodeField]
  const msg = res.data[messageField]
  // name: 接口名称，用于构建反馈文字，`${name}成功`
  const { name = '', method, url } = res.config
  const errorMessage = msg || ERROR_MSG[code]
  if (code === 0) {
    // 成功
    message.success(name ? `${name}成功` : msg)
  } else if (code === -1) {
    // 未知错误
    message.error(errorMessage, messageDuration)
  } else if (code < 20000) {
    // 信息有误
    message.warn(errorMessage, messageDuration)
  } else if (code < 30000) {
    // 业务错误
    notification.warn({
      message: name ? `${name}失败` : errorMessage,
      description: `${method} ${url} (${code}: ${errorMessage})`,
      duration: notificationDuration
    })
  } else if (code < 40000) {
    // 风险操作二次确认
    // 根据业务需求处理
  } else if (code < 100000) {
    // 请求错误
    notification.warn({
      message: errorMessage,
      description: `${method} ${url} ${res.message}`,
      duration: notificationDuration
    })
  } else {
    // 网络链接问题
    const { message, response } = res
    notification.warn({
      message: message,
      description: `${method} ${url} ${response.status}(${response.statusText})`,
      duration: notificationDuration
    })
  }
}

/**
 * 请求管理
 */
const CancelToken = axios.CancelToken
let uid = 0
let urlMap = {}
let cancelTokens = {}

/**
 * 检查请求模式及CancelToken是否存在
 * mode: 请求模式，可以设置为
 * 1. replace: 默认值，将会取消前一次相同请求，重新发起新的请求，相同请求的判断依据为`${config.method}@${config.url}`
 * 2. repeat: 允许重复发起相同请求，适合并发请求
 * 3. block: 阻塞，只要前一次相同请求没结束，新的请求就不能发起
 * @returns {Boolean} true: 允许发起请求. false: 禁止发起请求
 */
const checkCancelToken = function (config) {
  const { mode = 'replace' } = config
  if (mode === 'replace') {
    // 取消已有请求
    executeCancelToken(config)
    removeCancelToken(config)
  } else if (mode === 'block') {
    // 检测是否存在相同请求
    const key = `${config.method}@${config.url}`
    if (urlMap[key] && urlMap[key] > 0) {
      return false
    }
  }
  return true
}

/**
 * 创建CancelToken
 */
const createCancelToken = function (config) {
  const key = `${config.method}@${config.url}`
  if (!(key in urlMap)) {
    urlMap[key] = 0
  }
  config.cancelToken = new CancelToken(function (cancelFn) {
    // receives a cancel function as a parameter
    uid++
    config.cancelId = uid
    cancelTokens[uid] = cancelFn
    urlMap[key] += 1
  })
}

/**
 * 执行取消请求操作
 */
const executeCancelToken = function (config) {
  const uid = config.cancelId
  uid && cancelTokens[uid]('Request Canceled')
}

/**
 * 清理CancelToken
 */
const removeCancelToken = function (config) {
  // 注：config.cancelToken 不能删
  const key = `${config.method}@${config.url}`
  const uid = config.cancelId
  if (key in urlMap) {
    urlMap[key] -= 1
  }
  delete cancelTokens[uid]
  delete config.cancelId
}

/**
 * 取消所有请求
 */
const cancelAllRequest = function () {
  Object.values(cancelTokens).reduce((_, f) => f('Request Canceled'))
  urlMap = {}
  cancelTokens = {}
}

/**
 * 创建新的axios实例
 */
const instance = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30秒超时
  headers: {
    'Cache-Control': 'no-cache'
  }
})

// 发出请求前拦截
// 在header里加入token
// 注：此处无需设置error处理方法，因为该拦截总是`fulfilled`，相关源码：
// https://github.com/axios/axios/blob/0d8765562401910c1c509f6739a3bc558721e123/lib/core/Axios.js#L50
instance.interceptors.request.use(
  config => {
    if (checkCancelToken(config)) {
      createCancelToken(config)
      config.headers.common.Authorization = `JWT ${getToken()}`
      return config
    } else {
      // 阻塞请求抛出错误
      return Promise.reject(new Error('Request has been blocked'))
    }
  }
)

// 响应拦截
// 对响应码做对应提示
// 返回原始响应体
instance.interceptors.response.use(
  /*
    Response Schema
    {
      config: {},
      data: {}, // the response that was provided by the server
      headers: {}, // HTTP headers, lower case, can be accessed by `response.headers['content-type']`
      request: {}, // XMLHttpRequest instance
      status: 200, // HTTP status code
      statusText: 'OK', // HTTP status message
    }
  */
  response => {
    // 2XX状态码
    feedbackHandler(response)
    removeCancelToken(response.config)
    return response
  },

  error => {
    // 非2XX状态码
    // console.log(error.toJSON())
    // console.log(error.response) // 响应实例
    // console.log(error.data) // 响应数据
    // console.log(error.config) // 请求配置
    var code
    if (error.data) {
      // 业务错误
      code = error.data[errorCodeField] || -1
    } else if (error.message === 'Network Error') {
      // 网络错误
      code = 90001
    } else if (error.message.indexOf('timeout') === 0) {
      // 超时
      code = 90002
    } else if (axios.isCancel(error)) {
      // 请求取消
      code = 90003
      error.config.feedback = false
    }

    if (code > 90000) {
      feedbackHandler({
        data: {
          [errorCodeField]: code
        },
        config: error.config
      })
    } else {
      feedbackHandler(error)
    }

    removeCancelToken(error.config)

    // 登录超时
    if (error && error.response && error.response.status === 401) {
      cancelAllRequest()
      removeToken()
      sleep(1000).then(() => window.location.reload())
    }
    console.error('Request Error: ', error)
    return Promise.reject(error)
  }
)

export default instance

export async function ajax (config) {
  // 对响应体做进一步处理，再转交给业务处理
  const response = await instance(config)
    .then(res => res.data) // 获取响应数据
    .catch(e => Promise.reject(e.data))
  return response[dataField] // 返回响应数据中的业务处理结果
}
