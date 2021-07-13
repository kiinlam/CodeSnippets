import html from '@rollup/plugin-html';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { loadEnv } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';
import styleImport from 'vite-plugin-style-import';
import { name } from './package.json';

export default ({ command, mode }) => {
  const root = process.cwd();
  const viteEnv = loadEnv(mode, root); // 使用loadEnv获取环境变量，这里使用不了import.meta.env
  const { VITE_APP_DOMAIN, VITE_APP_PUBLIC_PATH } = viteEnv;
  const publicPath = `${VITE_APP_DOMAIN}${VITE_APP_PUBLIC_PATH}`
  const external = ['vue', 'vue-router'] // html模板和build.rollupOptions.external都使用此变量
  const cdnResource = { // 通用的静态资源使用统一外链
    // 生产地址
    'vue': 'https://unpkg.com/vue@next',
    'vue-router': 'https://unpkg.com/vue-router@4'
  }
  // 生成@rollup/plugin-html的html模板
  const template = ({ attributes, bundle, files, publicPath, title }) => {
    const links = files.css.map(css => `<link rel="stylesheet" href="${publicPath}${css.fileName}">`).join('')
    const externalScript = external.map(script => `<script src="${cdnResource[script]}"></script>`).join('')
    const scripts = files.js.map(js => `<script src="${publicPath}${js.fileName}"></script>`).join('')
    return `
    <!DOCTYPE html>
    <html lang="zh-cn">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${publicPath}favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        ${links}
      </head>
      <body>
        <div id="app"></div>
        ${externalScript}
        ${scripts}
      </body>
    </html>
  `
  }
  return {
    base: publicPath,
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }, { find: '#', replacement: path.resolve(__dirname, 'types') }],
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          // 修改全局的less变量；修改antd前缀同时还需使用ConfigProvider组件，参考App.vue内的配置
          modifyVars: {
            // Used for global import to avoid the need to import each style file separately
            // reference:  Avoid repeated references
            hack: `true; @import (reference) "${path.resolve(__dirname, './src/style/variable.less')}";`,
            'ant-prefix': 'ant-bdr-sub', // 修改前缀
            // 定制主题
            // https://2x.antdv.com/docs/vue/customize-theme-cn
            'primary-color': '#009E94', // 全局主色
            'link-color': '#009E94', // 链接色
            // 'success-color': '#52c41a', // 成功色
            // 'warning-color': '#faad14', // 警告色
            // 'error-color': '#f5222d', // 错误色
            // 'font-size-base': '14px', // 主字号
            // 'heading-color': 'rgba(0, 0, 0, 0.85)', // 标题色
            // 'text-color': 'rgba(0, 0, 0, 0.65)', // 主文本色
            // 'text-color-secondary': 'rgba(0, 0, 0, 0.45)', // 次文本色
            // 'disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
            // 'border-radius-base': '2px', // 组件/浮层圆角
            'border-color-base': '#ecf0f0', // 边框色
            // 'box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', // 浮层阴影
          }
        }
      }
    },
    plugins: [
      vue(),
      // 按需引入antdv组件
      styleImport({
        libs: [{
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/index`;
          },
        }]
      }),
      viteMockServe({
        mockPath: 'mock'
      }),
    ],
    build: {
      // minify: false,
      // sourcemap: true,
      target: "esnext",
      // rollup打包后会优先使用globalThis为全局变量 https://github.com/rollup/rollup/issues/3666
      // qiankun 2.4.0版本修复了不处理globalThis的bug https://github.com/umijs/qiankun/compare/v2.3.6...v2.4.0
      lib: { // 打包为lib才能被qiankun引入
        name: `${name}`,
        entry: path.resolve(__dirname, "src/main.ts"),
        formats: ["umd"],
      },
      rollupOptions: {
        external,
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]', // 打包生成css、img等文件名称https://rollupjs.org/guide/en/#outputassetfilenames
          entryFileNames: `assets/${name}.[format].[hash].js`, // 打包生成js文件名称https://rollupjs.org/guide/en/#outputentryfilenames
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          // vue.js和vue-router.js内原本通过var定义全局变量，在qiankun环境内无法将全局变量挂到window上，手动修改为了window.Vue和window.VueRouter
          globals: {
            vue: 'Vue',
            'vue-router': 'VueRouter'
          }
        },
        plugins: [ // @rollup/plugin-html需要添加在rollupOptions.plugins里，直接添加在plugins里生成不了css链接，应该是bug
          html({
            title: 'vite',
            publicPath,
            template
          })
        ]
      },
      terserOptions: {
        compress: {
          keep_infinity: true,
          // 非开发环境清除console debugger
          // drop_console: mode !== 'development',
          drop_debugger: mode !== 'development'
        },
      },
    },
    server: {
      port: '5000',
      proxy: {
        '/api': {
          target: 'https://192.168.1.2',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      },
    }
  }
}
