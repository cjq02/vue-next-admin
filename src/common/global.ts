import * as echarts from 'echarts'

declare module 'vue' {
  export interface ComponentCustomProperties {
    $onceMessage: typeof import('@/utils/message.utils')['default']
    $showResponseMessage: typeof import('@/utils/message.utils')['default']
    $echarts: typeof import('echarts')
  }
}

export default function (app) {
  app.config.globalProperties.$api = $api
  app.config.globalProperties.$utils = $utils
  app.config.globalProperties.$filters = $filters
  app.config.globalProperties.$onceMessage = $utils.messageUtils.onceMessage
  app.config.globalProperties.$showResponseMessage = $utils.messageUtils.showResponseMessage
  app.config.globalProperties.$log = $utils.log
  app.config.globalProperties.$dayjs = dayjs
  app.config.globalProperties.$echarts = echarts
  app.config.globalProperties.Enum = Enum
  app.config.globalProperties.Code = Code
  app.config.globalProperties.TRUE = TRUE
  app.config.globalProperties.FALSE = FALSE
  app.config.globalProperties.Constants = Constants
  app.config.globalProperties.__ = _

  Object.defineProperty(app.config.globalProperties, '$_', { value: _ })

  /* app.config.warnHandler = function (msg, vm, trace) {
    // `trace` 是组件的继承关系追踪
    console.warn(msg)
  }*/
}
