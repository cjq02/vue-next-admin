<template>
  <div>
    <div v-if="editable || $slots.controlsRight" class="clearfix mb10">
      <el-button
        v-if="editable"
        type="success"
        size="small"
        icon="plus"
        class="fl"
        :disabled="disabledHandle"
        @click="add"
      >
        新增
      </el-button>
      <div v-if="$slots.controlsRight" class="fr">
        <slot name="controlsRight" />
      </div>
    </div>
    <el-table
      ref="tableRef"
      :data="dataExcludeDelete"
      style="width: 100%"
      border
      v-bind="$attrs"
      :show-header="showHeader"
      :max-height="maxHeight"
      :height="autoHeight ? null : tableHeight"
    >
      <el-table-column v-if="editable && showOperate" label="操作" :width="defaultOperationColumnWidth" align="center">
        <template #default="scope">
          <el-button
            v-if="showInsertRow"
            type="primary"
            text
            size="small"
            :disabled="disabledHandle"
            @click.prevent="insert(scope.row)"
          >
            增行
          </el-button>
          <el-button type="danger" text size="small" :disabled="disabledHandle" @click.prevent="remove(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
      <slot name="tableColumns" :data="dataExcludeDelete" :get-row-index="getRowIndex" />
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'EditTable',
}
</script>
<script setup>
const { proxy } = getCurrentInstance()

const emit = defineEmits(['update:data', 'after-add'])
const props = defineProps({
  /**
   * 增行位置
   * */
  addRowPosition: {
    default: 'top',
    type: String,
  },

  autoHeight: {
    default: true,
    type: Boolean,
  },

  beforeAdd: {
    default: null,
    type: Function,
  },

  data: {
    default: () => [],
    type: Array,
  },

  defaultRowData: {
    default: () => {},
    type: Object,
  },
  /**
   * 直接从列表中删除，不记录 rowState = Delete
   */
  directlyDelete: {
    default: false,
    type: Boolean,
  },

  editable: {
    default: true,
    type: Boolean,
  },

  formRef: {
    default: () => {},
    type: Object,
  },

  maxHeight: {
    default: 500,
    type: Number,
  },
  operationColumnWidth: {
    default: '',
    type: String,
  },
  showHeader: {
    default: true,
    type: Boolean,
  },
  showInsertRow: {
    default: false,
    type: Boolean,
  },
  /**
   * 展示操作
   * */
  showOperate: {
    default: true,
    type: Boolean,
  },

  tableHeight: {
    default: 500,
    type: Number,
  },
})

const { data, formRef, defaultRowData } = toRefs(props)

const tableRef = ref()
const disabledHandle = ref(false)
const originTableData = ref([])

// noinspection JSValidateTypes
const tableData = computed({
  get: () => data.value,
  set: (newVal) => emit('update:data', newVal),
})

function setModifiedRowState() {
  const unchangedList = _.filter(tableData.value, (rowData) => rowData.rowState === Constants.rowState.UNCHANGED)
  const diffList = _.differenceWith(unchangedList, originTableData.value, (oldValue, newValue) => {
    return _.isEqual(_.omit(oldValue, 'rowNo'), _.omit(newValue, 'rowNo'))
  })
  _.each(diffList, (rowData) => {
    rowData.rowState = Constants.rowState.MODIFIED
  })
}

function setRowNo() {
  _.each(tableData.value, (rowData, index) => {
    rowData.rowNo = index + 1
  })
}

const handleTableData = _.debounce(
  () => {
    formRef.value?.clearValidate()
    setRowNo()
    setModifiedRowState()
  },
  200,
  { trailing: true },
)

// noinspection JSCheckFunctionSignatures
watch(() => tableData.value, handleTableData, { deep: true })

const dataExcludeDelete = computed(() => {
  return _.filter(tableData.value, (item) => item.rowState !== Constants.rowState.DELETED)
})

const defaultOperationColumnWidth = computed(() => {
  if ($utils.isNotEmpty(props.operationColumnWidth)) {
    return props.operationColumnWidth
  }
  if (props.showInsertRow) {
    return '125'
  }
  return '80'
})

onMounted(() => {
  originTableData.value = _.cloneDeep(tableData.value)
  /* console.log('origin table data', originTableData.value)*/
})

function getRowIndex(rowData) {
  return _.findIndex(tableData.value, { rowNo: rowData.rowNo })
}

function getNewRow() {
  // noinspection JSUnresolvedFunction
  return {
    ...defaultRowData.value,
    rowState: Constants.rowState.ADDED,
  }
}

function delayHandler(callback) {
  disabledHandle.value = true
  callback()
  setTimeout(() => {
    disabledHandle.value = false
  }, 300)
}

function add() {
  if (_.isFunction(props.beforeAdd) && !props.beforeAdd()) {
    return
  }
  if ($utils.isEmpty(tableData.value)) {
    tableData.value = []
  }
  nextTick(() => {
    delayHandler(() => {
      /* console.log('tableData.value', tableData.value)*/
      if (props.addRowPosition === 'bottom') {
        tableData.value.push(getNewRow())
        nextTick(() => {
          tableRef.value.setScrollTop(tableRef.value.$el.querySelector('.el-table__body').scrollHeight)
        })
        emit('after-add', tableData.value[tableData.value.length - 1])
      } else if (props.addRowPosition === 'top') {
        tableData.value.unshift(getNewRow())
        emit('after-add', tableData.value[0])
      } else {
        $utils.messageUtils.message.error('新增失败，未配置增行方向！')
      }
    })
  })
}

function addList(rowDataList) {
  tableData.value.push(..._.map(rowDataList, (rowData) => ({ ...rowData, rowState: Constants.rowState.ADDED })))
}

function insert(rowData) {
  delayHandler(() => tableData.value.splice(getRowIndex(rowData), 0, getNewRow()))
}

async function remove(rowData) {
  const { id } = rowData
  const index = getRowIndex(rowData)
  if (_.isEmpty(id)) {
    return delayHandler(() => tableData.value.splice(index, 1))
  }
  try {
    await proxy.$confirm('确定删除该记录?', '提示', {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      type: 'warning',
    })
    const deleteRow = _.find(tableData.value, { id })
    if (!props.directlyDelete) {
      deleteRow.rowState = Constants.rowState.DELETED
    } else {
      _.remove(tableData.value, (row) => row.id === deleteRow.id)
    }
  } catch (e) {
    console.error(e)
  }
}

defineExpose({ add, addList, dataExcludeDelete, insert, remove, tableData })
</script>
