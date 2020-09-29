/**
 * 使用webpack提供的require.context()方法, 将文件夹下的模块引入
 * 参考链接
 * https://webpack.js.org/guides/dependency-management/#requirecontext
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