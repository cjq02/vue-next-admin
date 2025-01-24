<template>
  <div id="Sidebar" class="reset-menu-style menu-wrapper">
    <div :class="{ 'has-logo': settings.sidebarLogo }">
      <div class="logo">
        <div class="logo-info">
          <div class="tc">{{ shortName }}</div>
        </div>
      </div>
    </div>
    <!--router nav-->
    <el-scrollbar>
      <el-menu
        class="el-menu-vertical"
        :default-active="activeMenu"
        :collapse="!isCollapse"
        :unique-opened="true"
        :collapse-transition="false"
        :background-color="scssJson.menuBg"
        :text-color="scssJson.menuText"
        :active-text-color="scssJson.menuActiveText"
        mode="vertical"
      >
        <sidebar-item v-for="item in routes" :key="item.path" :item="item" :base-path="item.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed, reactive, toRefs } from 'vue'
// 导入配置文件
import { useRoute } from 'vue-router'

// get scss variable
import scssExportJson from '@/styles/variables-to-js.scss?inline'

import SidebarItem from './SidebarItem.vue'

const store = useStore()
const route = useRoute()
const routes = computed(() => {
  return store.menu.routes
})
const isCollapse = computed(() => {
  return store.app.sidebar.opened
})
const settings = computed(() => {
  return store.app.settings
})

const dillScssExportToJson = (scssExportJson) => {
  const jsonString = scssExportJson.replace(/:export\s*/, '').replace(/[\s+\r\n]/g, '')
  const scssJson = {}
  jsonString
    .slice(1, jsonString.length - 2)
    .split(';')
    .forEach((fItem) => {
      const arr = fItem.split(':')
      scssJson[arr[0]] = arr[1]
    })
  return scssJson
}

const scssJson = dillScssExportToJson(scssExportJson)
const activeMenu = computed(() => {
  const { meta, fullPath } = route
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return fullPath
})
const state = reactive({
  shortName: store.app.settings.title,
})
// export to page for
const { shortName } = toRefs(state)

provide('getActiveMenu', () => activeMenu.value)
</script>

<style lang="scss" scoped>
.logo {
  overflow: hidden;
  box-sizing: content-box;
  margin-bottom: 5px;
  padding: 10px;
  border-bottom: 1px solid #104698;
  height: 50px;
  background: #0a3879;
  line-height: 22px;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  color: #eee;
  letter-spacing: 1px;
  span {
    display: block;
  }
  .logo-info {
    overflow: hidden;
    padding-top: 8px;
    height: 35px;
    line-height: 35px;
    text-align: left;
    .logo-img {
      margin-right: 10px;
      width: 35px;
      vertical-align: top;
    }
    label {
      display: inline-block;
      margin-left: 10px;
      line-height: 35px;
      vertical-align: top;
    }
  }
}
.hideSidebar .sidebar-container .logo {
  /* opacity: 0;  padding-top: 0; */
  img {
    width: 32px;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.el-menu--vertical[x-placement='right-start'] {
  background-color: #000 !important;
  .el-menu-item {
    background-color: #303133 !important;
    :hover {
      background-color: #303133 !important;
      color: #fff !important;
    }
  }
}
.reset-menu-style {
  .el-menu {
    border-right: none;
  }
  .el-scrollbar__wrap {
    padding-bottom: 8vh;
  }
}
.el-menu--vertical {
  width: $sideBarWidth;
  > .el-menu--popup {
    overflow-y: auto;
    max-height: 100vh;
    &::-webkit-scrollbar-track-piece {
      background: #d3dce6;
    }
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 20px;
      background: #99a9bf;
    }
  }
}
.el-menu--collapse {
  width: 54px;
}
</style>
