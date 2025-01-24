<template>
  <el-icon class="el-svg-icon">
    <component :is="ElSvg[elSvgName]" />
  </el-icon>
</template>

<script setup>
import * as ElSvg from '@element-plus/icons-vue'

const props = defineProps({
  elSvgName: {
    require: true,
    default: 'Fold',
    type: String,
  },
})
const { elSvgName } = props
</script>

<style scoped lang="scss">
.el-svg-icon {
  margin-left: -2px; //el-svg-icon has some margin
  width: 1em;
  height: 1em;
  text-align: left !important;
  font-size: 20px !important;
}
</style>
