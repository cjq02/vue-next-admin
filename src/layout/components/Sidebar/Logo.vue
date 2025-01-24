<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="showLogo" alt src="@/assets/layout/logo.png" class="sidebar-logo" />
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="showLogo" alt src="@/assets/layout/logo.png" class="sidebar-logo" />
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script setup>
import { computed, reactive, toRefs } from 'vue'

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
})

const store = useStore()
const settings = computed(() => {
  return store.app.settings
})
const state = reactive({
  title: settings.value.title,
  logo: '@/assets/layout/logo.png',
  showLogo: true,
})
// export to page for
const { title, showLogo } = toRefs(state)
</script>

<style lang="scss">
/*
   vue3.0 过度效果
   enter-> enter-from
   leave-> leave-from
  */
.sidebarLogoFade-enter-active {
  transition: opacity 2s;
}
.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.sidebar-logo-container {
  overflow: hidden;
  position: relative;
  padding-left: 14px;
  width: 100%;
  height: 50px;
  background: #2b2f3a;
  line-height: 50px;
  text-align: left;
  & .sidebar-logo-link {
    width: 100%;
    height: 100%;
    & .sidebar-logo {
      margin-right: 12px;
      width: 32px;
      height: 32px;
      vertical-align: middle;
    }
    & .sidebar-title {
      display: inline-block;
      margin: 0;
      line-height: 50px;
      vertical-align: middle;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      font-weight: 600;
      font-size: 14px;
      color: #fff;
    }
  }
  &.collapse {
    .sidebar-logo {
      margin-right: 0;
    }
  }
}
</style>
