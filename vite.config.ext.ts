// noinspection JSUnusedGlobalSymbols

import dayjs from 'dayjs'
import durationExt from 'dayjs/plugin/duration'
// @ts-ignore
import { writeFileSync } from 'fs'
import AutoImport from 'unplugin-auto-import/vite'

import AutoImportsConfig from './auto-imports.config'

dayjs.extend(durationExt)

export function durationLogger() {
  const timeObj = {
    buildEndTs: null,
    buildStartTs: null,
    finishTs: null,
    timespan: 0,
  }
  return {
    buildEnd: () => {
      timeObj.buildEndTs = dayjs()
      console.log(
        'Build End At：',
        timeObj.buildEndTs.format('YYYY-MM-DD HH:mm:ss'),
        ', Duration: ',
        dayjs.duration(timeObj.buildEndTs.diff(timeObj.buildStartTs)).format('mm:ss'),
      )
    },
    buildStart: () => {
      timeObj.buildStartTs = dayjs()
      console.log('Build Start At：', timeObj.buildStartTs.format('YYYY-MM-DD HH:mm:ss'))
      dayjs.duration(timeObj.buildStartTs.diff(timeObj.buildStartTs)).format('mm:ss')
    },
    closeBundle: () => {
      timeObj.finishTs = dayjs()
      console.log(
        'Finished At：',
        timeObj.finishTs.format('YYYY-MM-DD HH:mm:ss'),
        ', Duration: ',
        dayjs.duration(timeObj.finishTs.diff(timeObj.buildStartTs)).format('mm:ss'),
      )
    },
  }
}

export function autoImport() {
  return AutoImport({
    // Enable auto import by filename for default module exports under directories
    defaultExportByFilename: true,

    // Auto import for module exports under directories
    // by default it only scan one level of modules under the directory
    dirs: [
      // './hooks',
      // './composables' // only root modules
      // './composables/**', // all nested modules
      // ...
    ],

    // Filepath to generate corresponding .d.ts file.
    // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
    // Set `false` to disable.
    dts: './auto-imports.d.ts',

    // Generate corresponding .eslintrc-auto-import.json file.
    // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
    eslintrc: {
      // Default `false`
      enabled: true,
      // provide path ending with `.mjs` or `.cjs` to generate the file with the respective format
      // Default `./.eslintrc-auto-import.json`
      filepath: './.eslintrc-auto-import.json',
      // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      globalsPropValue: true,
    },

    // Array of strings of regexes that contains imports meant to be ignored during
    // the declaration file generation. You may find this useful when you need to provide
    // a custom signature for a function.
    ignoreDts: ['ignoredFunction', /^ignore_/],
    imports: [
      // @ts-ignore
      'vue',
      // @ts-ignore
      'vue-router',
      {
        // @ts-ignore
        '@/api': [['default', '$api']],
        '@/common/code': [['default', 'Code']],
        '@/common/constants': [['*', 'Constants'], 'TRUE', 'FALSE'],
        '@/common/enum': [['default', 'Enum']],
        '@/filters': [['default', '$filters']],
        '@/hooks/useBaseForm': ['useBaseForm'],
        '@/hooks/useBasePage': ['useBasePage', 'useBaseEditPage'],
        '@/hooks/usePermission': ['usePermission'],
        '@/hooks/useValidator': ['useValidator'],
        '@/store': [['default', 'useStore']],
        '@/store/app.store': [['default', 'useAppStore']],
        '@/store/business.store': [['default', 'useBusinessStore']],
        '@/store/code.store': [['default', 'useCodeStore']],
        '@/store/menu.store': [['default', 'useMenuStore']],
        '@/store/tagsView.store': [['default', 'useTagsViewStore']],
        '@/store/user.store': [['default', 'useUserStore']],
        '@/utils': [['default', '$utils']],
        '@/utils/api.utils': [['*', 'apiUtils']],
        '@/utils/bus': [['default', 'emitter']],
        '@/utils/common.utils': [['*', 'commonUtils']],
        '@/utils/libs/dayjs': [['default', 'dayjs']],
        '@/utils/libs/lodash': [
          ['default', '_'],
          ['default', '__'],
        ],
        '@/utils/message.utils': [['default', 'messageUtils']],
        '@/utils/number.utils': [['default', 'numberUtils']],
        'element-plus': [
          ['ElMessageBox', 'MessageBox'],
          ['ElLoading', 'Loading'],
        ],
        jquery: [['default', 'jq']],
        ...AutoImportsConfig.customImports,
      },
    ],

    // targets to transform
    include: [
      // .ts, .tsx, .js, .jsx
      /\.[tj]sx?$/,
      /\.vue$/,
      // .md
      /\.vue\?vue/,
      // .md
      /\.md$/,
    ],

    // Inject the imports at the end of other imports
    injectAtEnd: true,

    // Custom resolvers, compatible with `unplugin-vue-components`
    // see https://github.com/antfu/unplugin-auto-import/pull/23/
    resolvers: [
      /* ... */
    ],

    // Auto import inside Vue template
    // see https://github.com/unjs/unimport/pull/15 and https://github.com/unjs/unimport/pull/72
    vueTemplate: true,
  })
}

export function registerProxyEvents(proxy) {
  proxy.on('proxyRes', function (proxyRes, req) {
    if (req.url.includes('/sys/code/generateCode.json')) {
      console.log('proxy req for' + req.url)
      // @ts-ignore
      let buffer = new Buffer('')
      proxyRes.on('data', function (data) {
        // @ts-ignore
        buffer = Buffer.concat([buffer, data])
      })

      proxyRes.on('end', function () {
        try {
          const res = JSON.parse(buffer.toString())
          Object.keys(res.info).forEach((fileName) => {
            writeFileSync(`src/common/${fileName}`, res.info[fileName])
          })
        } catch (e) {
          console.error(e)
        }
      })
    }
  })
}

export const viewFileLoading = ({ command }) => ({
  configureServer({ middlewares }) {
    if (command !== 'serve') {
      return
    }
    middlewares.use((req, res, next) => {
      req.startTime = new Date()
      const calResponseTime = function () {
        const endTime = new Date()
        const duration = dayjs(endTime).diff(req.startTime, 'millisecond')
        if (duration >= 1000) {
          console.log(
            `【加载开始时间】${dayjs(req.startTime).format('YYYY-MM-DD HH:mm:ss')}`,
            `【加载结束时间】${dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')}`,
            `【耗时】${duration}`,
            `【URL】${req.url}`,
          )
        }
      }

      res.once('finish', calResponseTime)
      /* res.once('close', calResponseTime)*/
      next()
    })
  },
  name: 'configure-server',
})
