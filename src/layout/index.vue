<template>
  <div :class="classObj" class="layout-wrapper app-wrapper">
    <!--left side-->
    <Sidebar v-if="settings.showLeftMenu" class="sidebar-container" />
    <!--right container-->
    <div class="main-container">
      <div id="main-header" :class="{ 'fixed-header': settings.fixedHeader }">
        <Navbar v-if="settings.showTopNavbar" />
        <TagsView v-if="settings.showTagsView" />
      </div>
      <AppMain />
    </div>
    <ResetPwd v-model:visible="showResetPasswordDialog" />
  </div>
</template>
<!--原理vue2.0-->
<script lang="ts">
/* 可以设置默认的名字*/
export default {
  name: 'Layout',
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { AppMain, Navbar, Sidebar, TagsView } from './components'
import ResetPwd from './components/ResetPwd/index.vue'

const store = useStore()
const showResetPasswordDialog = ref(false)
const opened = computed(() => {
  return store.app.sidebar.opened
})
const settings = computed(() => {
  return store.app.settings
})
const classObj = computed(() => {
  return {
    closeSidebar: !opened.value,
    hideSidebar: !settings.value.showLeftMenu,
  }
})

onMounted(async () => {
  if (store.user.userInfo.isDefaultPwd === TRUE) {
    showResetPasswordDialog.value = true
  }
})
// import ResizeHook to  listen  page size that  open or close
import ResizeHook from './hook/useResizeHandler'

ResizeHook()
</script>

<style lang="scss" scoped>
.main-container {
  position: relative;
  margin-left: $sideBarWidth;
  min-height: 100%;
  transition: margin-left 0.28s;
}
.sidebar-container {
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1001;
  width: $sideBarWidth !important;
  height: 100%;
  background-color: $menuBg;
  font-size: 0;
  transition: width 0.28s;
}
.closeSidebar {
  .sidebar-container {
    width: 54px !important;
  }
  .main-container {
    margin-left: 54px !important;
  }
}
.hideSidebar {
  .sidebar-container {
    width: 0 !important;
  }
  .main-container {
    margin-left: 0;
  }
}
</style>
