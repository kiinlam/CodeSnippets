import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import html from '@rollup/plugin-html'
import Components from 'unplugin-vue-components/vite'
// import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import configStyleImportPlugin from './andtvStyleImport'
import replace from '@rollup/plugin-replace'
import path from 'path'
import { name } from './package.json'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // npm run dev -> command: serve, mode: development
  // npm run build -> command: build, mode: production
  // npm run serve -> command: serve, mode: production

  console.log('command:', command)
  console.log('mode:', mode)
  const env = loadEnv(mode, process.cwd()) // 此文件内无法直接获取到环境变量参数，封装了一个获取文件内容的方法
  console.log('env: ', env)
  const publicPath = `${env.VITE_APP_PUBLIC_PATH}`

  const htmlTemplate = ({ attributes, bundle, files, publicPath, title }) => {
    const links = files.css.map((css) => `<link rel="stylesheet" href="${publicPath}${css.fileName}">`).join('')
    const scripts = files.js.map((js) => `<script src="${publicPath}${js.fileName}"></script>`).join('')
    return `
    <!DOCTYPE html>
    <html lang="zh-cn">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${publicPath}favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        ${links}
        <script src="${publicPath}base-config.js"></script>
        <script src="https://gtp.bzlrobot.com/cdn/js/api-prefix/index.js"></script>
    </head>
      <body>
        <div id="app"></div>
        ${scripts}
      </body>
    </html>
    `
  }

  // 使用replace插件做替换(https://github.com/rollup/plugins/tree/master/packages/replace)
  // 处理低代码平台环境变量问题
  let replaceConfig = {}
  // 环境变量名映射为“替换字符串”键值对
  Object.keys(env).forEach((key) => {
    // 替换值支持字符串或返回字符串的函数
    // replaceConfig[`import.meta.env.${key}`] = (filename) => {
    //   console.log(filename) // 可用于调试
    //   return `(window['_FLY_GLOBAL_CONFIG'].${key} || import.meta.env.${key})`
    // }
    replaceConfig[`import.meta.env.${key}`] = `(window['_FLY_GLOBAL_CONFIG'].${key} || import.meta.env.${key})`
  })

  return {
    base: publicPath,

    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
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
            'ant-prefix': 'ant-bdr-sub',
            'primary-color': '#009E94',
            'danger-color': '#F76079',
            'border-radius-base': '5px',
          },
        },
      },
    },

    plugins: [
      vue(),
      Components(),
      // Components({
      //   resolvers: [
      //     AntDesignVueResolver({
      //       importStyle: 'less',
      //       resolveIcons: true,
      //     }),
      //   ],
      // }),
      configStyleImportPlugin(),
      {
        ...replace({
          include: ['src/**/*.ts', 'src/**/*.js', 'src/**/*.vue', 'src/**/*.html'],
          preventAssignment: true,
          sourceMap: false,
          values: {
            ...replaceConfig,
            // 其他自定义替换字符串
            // 'import.meta.env.VITE_APP_BTP_ENV': (file) => {
            //   console.log(file)
            //   return "(window['_FLY_GLOBAL_CONFIG'].VITE_APP_BTP_ENV || import.meta.env.VITE_APP_BTP_ENV)"
            // },
          },
        }),
      },
    ],

    build: {
      // minify: false,
      // sourcemap: true,
      target: 'esnext',
      // rollup打包后会优先使用globalThis为全局变量 https://github.com/rollup/rollup/issues/3666
      // qiankun 2.4.0版本修复了不处理globalThis的bug https://github.com/umijs/qiankun/compare/v2.3.6...v2.4.0
      lib: {
        // 打包为lib才能被qiankun引入
        name: `${name}`,
        entry: path.resolve(__dirname, 'src/main.ts'),
        formats: ['umd'],
      },
      rollupOptions: {
        output: {
          assetFileNames: '[name]-[hash][extname]', // 打包生成css、img等文件名称https://rollupjs.org/guide/en/#outputassetfilenames
          entryFileNames: `${name}.[format].[hash].js`, // 打包生成js文件名称https://rollupjs.org/guide/en/#outputentryfilenames
        },
        plugins: [
          html({
            title: '资源空间',
            publicPath,
            template: htmlTemplate,
          }),
        ],
      },
      terserOptions: {
        compress: {
          keep_infinity: true,
          // 非开发环境清除console debugger
          // drop_console: mode !== 'development',
          // drop_debugger: mode !== 'development'
        },
      },
    },

    server: {
      port: 5000,
      https: true,
      proxy: {
        '/api': {
          target: 'https://10.8.203.22/uat',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''), // 本地调试uat环境
        },
        '/ntsapi': {
          // 本地开发使用低代码平台dev环境
          target: 'https://nts-gateway-dev.bgy.com.cn/api/sso/autoapp-default-server-component',
          // target: 'https://nts-gateway-sit.bgy.com.cn/api/sso/autoapp-default-server-component',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/ntsapi/, ''),
        },
        '/sysapi': {
          // 本地开发使用低代码平台dev环境
          target: 'https://nts-gateway-dev.bgy.com.cn/api/sso/autoapp-ressystem-service',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/sysapi/, ''),
        },
        '/resapi': {
          // 本地开发使用低代码平台dev环境
          target: 'https://nts-gateway-dev.bgy.com.cn/api/sso/autoapp-resresource-service',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/resapi/, ''),
        },
      },
    },
  }
})
