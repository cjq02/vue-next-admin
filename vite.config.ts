/* eslint-disable camelcase */
// noinspection JSUnusedGlobalSymbols

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImportTypes from 'auto-import-types'
import path, { resolve } from 'path'
import { loadEnv } from 'vite'
// inject title
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteMockServe } from 'vite-plugin-mock'
import viteSvgIcons from 'vite-plugin-svg-icons'
// setup name
import VueSetupExtend from 'vite-plugin-vue-setup-extend-plus'

import * as settings from './src/settings'
import { autoImport, durationLogger, registerProxyEvents, viewFileLoading } from './vite.config.ext'

const { port, openProdMock } = settings

export default ({ command, mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  /* console.log('VITE_APP_BASE_URL', process.env.VITE_APP_BASE_URL);
  console.log('VITE_APP_BASE_API', process.env.VITE_APP_BASE_API);*/
  return {
    base: '/',
    build: {
      // build assets Separate
      assetsDir: 'static/assets',

      brotliSize: false,
      // 消除打包大小超过警告
      chunkSizeWarningLimit: 5000,

      minify: 'terser',
      rollupOptions: {
        output: {
          assetFileNames: ({ name }) => {
            if (/\.(gif|jpe?g|png)$/.test(name ?? '')) {
              return 'assets/img/[name]-[hash][extname]'
            }
            if (/\.svg$/.test(name ?? '')) {
              return 'assets/svg/[name]-[hash][extname]'
            }
            if (/\.css$/.test(name ?? '')) {
              return 'assets/css/[name]-[hash][extname]'
            }
            // default value
            // ref: https://rollupjs.org/guide/en/#outputassetfilenames
            return 'assets/[name]-[hash][extname]'
          },
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
        },
      },
      // remote console.log in prod
      terserOptions: {
        // detail to look https://terser.org/docs/api-reference#compress-options
        compress: {
          drop_console: false,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
        },
      },
    },
    clearScreen: false,
    css: {
      // https://github.com/vitejs/vite/issues/5833【保持关注】
      postcss: {
        plugins: [
          {
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              },
            },
            postcssPlugin: 'internal:charset-removal',
          },
        ],
      },

      preprocessorOptions: {
        // define global scss variable
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
          api: 'modern',
          charset: false,
          silenceDeprecations: ['import'],
        },
      },
    },
    define: {
      'process.env.VITE_APP_BASE_API': JSON.stringify(process.env.VITE_APP_BASE_API),
      'process.platform': null,
      'process.version': null,
    },
    esbuild: {
      target: 'chrome64',
    },
    plugins: [
      vue({ reactivityTransform: true }),
      vueJsx(),
      /* legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      }),*/
      viteSvgIcons({
        // config svg dir that can config multi
        iconDirs: [
          path.resolve(process.cwd(), 'src/icons/common'),
          path.resolve(process.cwd(), 'src/icons/nav-bar'),
          path.resolve(process.cwd(), 'src/icons/home'),
        ],
        // appoint svg icon using mode
        symbolId: 'icon-[dir]-[name]',
      }),
      // https://github.com/anncwb/vite-plugin-mock/blob/HEAD/README.zh_CN.md
      viteMockServe({
        // @ts-ignore
        injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `,
        localEnabled: command === 'serve',
        logger: true,
        mockPath: 'mock',
        prodEnabled: openProdMock,
      }),
      VueSetupExtend(),
      // auto config of index.html title
      createHtmlPlugin({
        inject: {
          // Inject data into ejs template
          data: {
            title: settings.title,
          },
        },
      }),
      autoImport(),
      AutoImportTypes(),
      viewFileLoading({ command }),
      /* Inspect(),*/
      durationLogger(),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        mock: resolve(__dirname, 'mock'),
        '~': resolve(__dirname, './'),
      },
    },
    server: {
      // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
      cors: true,

      // 禁用或配置 HMR 连接 设置 server.hmr.overlay 为 false 可以禁用服务器错误遮罩层
      hmr: { overlay: false },

      // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
      open: false,

      // 服务配置
      // 类型： number 指定服务器端口;
      port: process.env.VITE_PORT || port,
      // proxy look for https://vitejs.cn/config/#server-proxy
      proxy: {
        // 类型： Record<string, string | ProxyOp 为开发服务器配置自定义代理规则
        [`/${process.env.VITE_APP_BASE_API}`]: {
          changeOrigin: true,
          configure: (proxy) => registerProxyEvents(proxy),
          target: process.env.VITE_APP_BASE_URL,
        },
      },
    },
  }
}
