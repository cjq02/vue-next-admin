<template>
  <el-row>
    <el-col :span="8">
      <el-input v-model="value" v-numeric:decimal="{ precision: 10, scale: 6 }" size="small" />
    </el-col>
  </el-row>
</template>
<script>
export default {
  label: '数字文本框',
}
</script>
<script setup>
const value = ref(null)
</script>
