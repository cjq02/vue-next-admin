<template>
  <div>
    <div class="divTable">
      <div class="divTableBody">
        <div v-for="row in $utils.numberUtils.numberToArray(rows)" :key="row" class="divTableRow" :value="row">
          <div
            v-for="col in $utils.numberUtils.numberToArray(columns)"
            ref="cellRefs"
            :key="col"
            class="divTableCell"
            :class="{ active: activeCache[`[${row}, ${col}]`] }"
            @click="handleCellClick(row, col)"
          >
            &nbsp;
          </div>
        </div>
      </div>
    </div>
    <!-- DivTable.com -->
  </div>
</template>
<script>
export default {
  label: '仓库',
}
</script>
<script setup>
const rows = ref(30)
const columns = ref(30)
const cellRefs = ref([])
const activeCache = reactive({
  '[1, 1]': true,
})

function handleCellClick(row, col) {
  activeCache[`[${row}, ${col}]`] = true
  console.log(activeCache)
}
</script>
<style scoped lang="scss">
/* DivTable.com */
.divTable {
  display: table;
}
.divTableRow {
  display: table-row;
}
.divTableCell,
.divTableHead {
  display: table-cell;
  padding: 3px 10px;
  border: 1px solid #999;
}
.divTableHeading {
  display: table-header-group;
  background-color: #eee;
  font-weight: bold;
}
.divTableFoot {
  display: table-footer-group;
  background-color: #eee;
  font-weight: bold;
}
.divTableBody {
  display: table-row-group;
}
.divTableCell {
  &:hover {
    background-color: #c0c3fa;
  }
  &.active {
    background-color: #ffa7a7;
  }
}
</style>
