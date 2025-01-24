<template>
  <d2-container>
    <div class="app-container">
      <el-tabs v-model="activeName" class="file-tabs">
        <el-tab-pane v-for="tab in tabList" :key="tab.name" :label="tab.label" :name="tab.name"></el-tab-pane>
      </el-tabs>
      <component :is="activeTab.component"></component>
    </div>
  </d2-container>
</template>
<script lang="ts" setup>
const modules = import.meta.glob('./**/index.vue', { eager: true })

const tabList = _.map(modules, (module: any, path) => {
  const name = path.replace('./components/', '').replace('/index.vue', '')
  return {
    name,
    label: module.default.label || name,
    path,
    component: module.default,
  }
})

const activeName = ref('VirtualizedTable')
const activeTab = computed(() => {
  return _.find(tabList, { name: activeName.value })
})
</script>
<style>
.file-tabs > .el-tabs__content {
  font-weight: 600;
  font-size: 32px;
  color: #6b778c;
}
</style>
