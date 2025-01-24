<template>
  <d2-container>
    <div class="app-container">
      <el-tabs v-model="activeTab" class="file-tabs">
        <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name"></el-tab-pane>
      </el-tabs>
      <el-row class="mt20">
        <el-col v-for="iconName in iconNames" :key="iconName" :span="2" class="icon-cell">
          <div><svg-icon :icon-class="iconName"></svg-icon></div>
          <span class="icon-name">{{ iconName }}</span>
        </el-col>
      </el-row>
    </div>
  </d2-container>
</template>

<script>
export default {
  name: 'Icons',
}
</script>
<script setup>
const commonIcons = import.meta.glob('/src/icons/common/*.svg')
const navIcons = import.meta.glob('/src/icons/nav-bar/*.svg')

const tabs = {
  COMMON: { name: '1', label: '公共', icons: commonIcons },
  NAV: { name: '2', label: '菜单', icons: navIcons },
}
const activeTab = ref(tabs.COMMON.name)

const iconNames = computed(() => getIconNames(_.find(tabs, { name: activeTab.value }).icons))

const getIconNames = (icons) => _.map(icons, (icon, key) => key.split('/').reverse()[0].replace('.svg', ''))
</script>

<style scoped lang="scss">
.svg-icon {
  margin-left: -2px; //el-svg-icon has some margin
  width: 2em;
  height: 2em;
  text-align: left !important;
  font-size: 20px !important;
}
.icon-cell {
  height: 120px;
  text-align: center;
}
.icon-name {
  line-height: 30px;
}
</style>
