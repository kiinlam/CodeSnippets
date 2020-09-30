/**
 * 使用webpack提供的require.context()方法, 将文件夹下的模块引入
 * 参考链接
 * https://webpack.js.org/guides/dependency-management/#requirecontext
 * require.context() exports a (require) function that takes one argument: the request.
 *
 * The exported function has 3 properties: resolve, keys, id.
 *
 * resolve is a function and returns the module id of the parsed request.
 * keys is a function that returns an array of all possible requests that the context module can handle.
 * id is the module id of the context module. This may be useful for module.hot.accept
 */

/**
 * 引入js模块
 */

const modulesFiles = require.context('./modules', false, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

/**
 * 引入vue组件
 */
import Vue from 'vue'
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
const requireComponent = require.context('../components', true, /\.vue$/)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = capitalizeFirstLetter(
    /index.vue$/.test(fileName)
      ? fileName.replace(/^\.\//, '').replace(/\/index(.vue)$/, '')
      : fileName
        .replace(/^\.\//, '')
        .replace(/\w+\//, '')
        .replace(/(.vue)$/, '')
  )
  // console.log(componentName)
  Vue.component(componentName, componentConfig.default || componentConfig)
})