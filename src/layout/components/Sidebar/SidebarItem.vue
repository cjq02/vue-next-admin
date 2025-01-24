<template>
  <template v-if="!item.hidden">
    <template v-if="showSidebarItem(item.children, item)">
      <Link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <item v-if="!isNest" :meta="onlyOneChild.meta || item.meta" :is-active="isActive" />
          <template #title>
            <span class="menu-title">{{ onlyOneChild.meta?.title }}</span>
          </template>
        </el-menu-item>
      </Link>
    </template>
    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)">
      <template v-if="item.meta" #title>
        <item :meta="item.meta" :is-active="isActive" />
        <span class="menu-title">{{ item.meta.title }}</span>
      </template>
      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </template>
</template>

<script setup>
/* 初始化参数比如引入组件，proxy,state等*/
import path from 'path'
import { getCurrentInstance } from 'vue'

import { isExternal } from '@/utils/validate'

import Item from './Item.jsx'
import Link from './Link.vue'

const getActiveMenu = inject('getActiveMenu')

const { proxy } = getCurrentInstance()

defineProps({
  // 每一个router Item
  item: {
    type: Object,
    required: true,
  },
  // 用于判断是不是子Item,设置响应的样式
  isNest: {
    type: Boolean,
    default: false,
  },
  // 基础路径，用于拼接
  basePath: {
    type: String,
    default: '',
  },
})
// 显示sidebarItem 的情况
const onlyOneChild = ref(null)

const showSidebarItem = (children = [], parent) => {
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false
    }
    // Temp set(will be used if only has one showing child)
    onlyOneChild.value = item
    return true
  })
  if (showingChildren.length === 1 && onlyOneChild.value?.parentHidden) {
    return true
  }
  if (showingChildren.length === 0) {
    /* console.log('child', parent);*/
    onlyOneChild.value = { ...parent, path: '', noChildren: true }
    return true
  }
  return false
}
const resolvePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(proxy.basePath)) {
    return proxy.basePath
  }
  return path.resolve(proxy.basePath, routePath)
}

const isActive = computed(() => getActiveMenu() === resolvePath(onlyOneChild.value.path))
</script>
<style lang="scss" scoped>
:deep(.el-menu-tooltip__trigger) {
  display: block;
  padding: 0 18px !important;
}
:deep(.el-tooltip__trigger) {
  padding: 0 18px !important;
}
</style>
