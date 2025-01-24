import { defineStore } from 'pinia'

import * as settings from '@/settings'

const useAppStore = defineStore('app', {
  /** *
   *封装处理数据的函数（业务逻辑)：修改数据
   */
  actions: {
    openSidebar(data) {
      this.$patch((state) => {
        state.sidebar.opened = data
      })
    },
    toggleSidebar() {
      this.$patch((state) => {
        state.sidebar.opened = !state.sidebar.opened
      })
    },
    updateSettings(data) {
      this.$patch((state) => {
        state.settings = { ...state.settings, ...data }
      })
    },
  },
  /** *
   *类似于组件的 data数据的 ,用来存储全局状态的
   * 1、必须是箭头函数
   */
  state: () => {
    return {
      settings,
      sidebar: { opened: true },
    }
  },
})

export default useAppStore
