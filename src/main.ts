// noinspection SpellCheckingInspection

import '@/styles/index.scss' // global css
import 'element-plus/dist/index.css'
// import axios req
// svg-icon
// import svg-icon doc in  https://github.com/anncwb/vite-plugin-svg-icons/blob/main/README.zh_CN.md
import 'virtual:svg-icons-register'
// import router  intercept
import './permission'

// import element-plus
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// import pinia
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import global from '@/common/global'
// import global components
import components from '@/components/index'
// import global directive
import directive from '@/directive'
// import global mixins
import mixin from '@/mixins'

import App from './App.vue'
import router from './router'

const app = createApp(App)
global(app)
app.use(createPinia())
/*app.use(ElementPlus, {
  locale: zhCn,
})*/
app.use(ElementPlus)
app.use(components)
app.use(router)
directive(app)
mixin(app)

app.mount('#app')
