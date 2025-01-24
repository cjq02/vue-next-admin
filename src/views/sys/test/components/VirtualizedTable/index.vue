<template>
  <div style="height: 700px">
    <!--suppress HtmlUnknownTag -->
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2 :columns="columns" :data="tableData" :width="width" :height="height" fixed />
      </template>
    </el-auto-resizer>
  </div>
</template>

<script lang="ts">
export default {
  label: '虚拟化表格',
}
</script>
<script setup lang="ts">
import { columns } from './columns'

const tableData = ref([])

onMounted(async () => {
  tableData.value = await apiUtils.post('/test/getList.json', {})
  _.each(tableData.value, (rowData, idx) => {
    rowData.rowNo = idx + 1
  })
})
</script>
