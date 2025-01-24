/* 使用vue3.0 jsx语法书写*/
import { defineComponent } from 'vue'

import SidebarIcon from './SidebarIcon.vue'

export default defineComponent({
  props: {
    meta: {
      type: Object,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    /* 此处写法像极了react*/
    const renderItem = () => {
      // noinspection JSXNamespaceValidation
      return <SidebarIcon name={icon.value} />
    }

    const icon = computed(() => {
      return `${props.meta.icon}${props.isActive ? '-Filled' : ''}`
    })

    return () => {
      return renderItem()
    }
  },
})
