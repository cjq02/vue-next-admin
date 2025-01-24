<template>
  <div ref="container" class="container-component">
    <div class="container-component-con">
      <div class="d2-container-full">
        <div v-if="showHeader" ref="header" class="d2-container-full__header">
          <slot name="header" />
        </div>
        <div class="d2-container-full__body">
          <slot />
        </div>
        <div v-if="showFooter" ref="footer" class="d2-container-full__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 组件

export default {
  name: 'D2Container',
  computed: {
    showHeader() {
      return this.$slots.header && this.$slots.header().findIndex((o) => o.type !== Comment) !== -1
    },

    showFooter() {
      return this.$slots.footer && this.$slots.footer().findIndex((o) => o.type !== Comment) !== -1
    },
  },
  mounted() {},
}
</script>
