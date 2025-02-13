// 线上环境开启 vue devtools
// 方案一
// 以 element-ui 官网为例，执行后重启一下 chrome devtool
function func1() {
  var Vue, walker, node;
  walker = document.createTreeWalker(document.body,1);
  while ((node = walker.nextNode())) {
    if (node.__vue__) {
      Vue = node.__vue__.$options._base;
      if (!Vue.config.devtools) {
        Vue.config.devtools = true;
        if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
          window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit("init", Vue);
          console.log("==> vue devtools now is enabled");
        }
      }
      break;
    }
  }
}

// 方案二
function func2() {
  const el = document.querySelector('#app')
  const  vm = el.__vue_app__
  
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.apps.push({
      app: vm,
      version: vm.version,
      types: {
        Comment: Symbol("Comment"),
        Fragment: Symbol("Fragment"),
        Static: Symbol("Static"),
        Text: Symbol("Text"),
      },
  })
  if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
      window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit("init", vm);
      console.log("==> vue devtools now is enabled");
  }
}
