<template>
  <section class="m-table-comb">
    <!--数据过滤和按钮组-->
    <section v-if="showSearchForm" class="m-table-filter">
      <div class="m-search-filter">
        <el-form ref="searchFormRef" :model="searchModel" label-width="100px" size="small" style="font-size: 14px">
          <el-row :gutter="10">
            <!--基础查询-->
            <slot name="baseSearchForm" :form="searchModel" />
            <!--高级查询-->
            <slot v-if="slots.advancedSearchForm && showAdvancedSearch" name="advancedSearchForm" :form="searchModel" />
            <!--查询/重置-->
            <span
              v-if="showSearchControlsBtn"
              :class="btnSearchFloat"
              style="display: inline-block; margin-right: 5px; margin-top: 5px"
            >
              <slot name="controlsSearchBtn" />
              <el-button v-if="showSearchBtn" class="ml20" type="primary" size="small" @click="search">查询</el-button>
              <el-button v-if="showSearchBtn" class="ml10" size="small" @click="reset">重置</el-button>
              <el-link
                v-if="slots.advancedSearchForm"
                class="ml20"
                type="primary"
                :underline="false"
                @click="openAdvancedSearch()"
              >
                <template v-if="showAdvancedSearch">
                  收起
                  <el-icon><caret-top style="vertical-align: -2px" /></el-icon>
                </template>
                <template v-else>
                  展开
                  <el-icon><caret-bottom style="vertical-align: -2px" /></el-icon>
                </template>
              </el-link>
            </span>
          </el-row>
        </el-form>
      </div>
    </section>
    <!-- 控制按钮 -->
    <section
      v-if="showControls"
      class="clearfix control-btn-box"
      :style="showSearchForm ? 'padding:15px 0 10px 0' : 'padding:0 0 10px 0'"
    >
      <slot name="controlsLeft" />
      <slot name="controlsCenter" />
      <!--class="controls-center"-->
      <div class="fr">
        <slot name="controlsRight" />
        <div v-if="showDefaultControlsRight" class="fr vt">
          <el-button class="vt" type="primary" size="small" plain @click="exportTable">
            <svg-icon icon-class="link" class-name="el-icon--left" />
            导出
          </el-button>
          <el-button class="vt" type="primary" size="small" plain icon="printer" @click="printTable()">打印</el-button>
        </div>
      </div>
    </section>
    <!--数据表格-->
    <section v-if="showTable" class="table-content">
      <div class="w-table">
        <el-form ref="tableFormRef" :rules="tableRules" :model="tableModel">
          <el-table
            ref="tableRef"
            v-loading="loading"
            element-loading-text="数据正在加载，请稍候..."
            class="m-table"
            :data="tableData"
            border
            stripe
            style="width: 100%"
            :max-height="defaultMaxHeight"
            :height="props.autoHeight ? undefined : defaultTableHeight"
            :span-method="spanMethod"
            :highlight-current-row="highlight"
            :default-expand-all="defaultExpandAll"
            :row-key="rowKey"
            :tree-props="treeProps"
            :show-summary="showSummary"
            :summary-method="summaryMethod"
            :row-class-name="rowClassName"
            :scrollbar-always-on="scrollbarAlwaysOn"
            :header-cell-style="headerCellStyle"
            @select="checkedOne"
            @select-all="checkedAll"
            @sort-change="handleSortChange"
            @clear-selection="clearSelection"
            @current-change="currentChange"
            @row-click="rowClick"
          >
            <slot name="tableColumns" />
          </el-table>
        </el-form>
      </div>
    </section>
    <!--多选数据视图-->
    <section v-show="checkedItems && checkedItems.length > 0 && showMultipleChecked">
      <div class="checked-items">
        <transition-group tag="div" name="scale" mode="out-in">
          <span v-for="item in checkedItems" :key="'checkedItem_' + item[customId]">
            {{ item[checkedDisplayName] || item[customId] }}
            <i @click="removeCheckedItem(item)" />
          </span>
        </transition-group>
        <a href="javascript:void(0);" class="clear-all" @click="removeAllCheckedItem()">清空</a>
      </div>
    </section>
    <section v-if="hasLeftPart" class="left-section fl">
      <slot name="leftSection" />
    </section>
    <!--分页-->
    <section v-if="showTable && showPagination" class="table-paging">
      <el-pagination
        :current-page="pageInfo.currentPage"
        :page-sizes="pageSizes"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecord"
        :class="{ fr: hasLeftPart }"
        @size-change="handleSizeChange"
        @current-change="fetchData"
      />
    </section>
  </section>
</template>

<script lang="ts">
export default {
  name: 'TableComb',
}
</script>
<script setup lang="ts">
import ExcelUtils from '@/utils/excel.utils'

import { baseProps } from './props'

const slots = useSlots()
const router = useRouter()
const props = defineProps(baseProps)
const {
  showSearchForm,
  baseSearchModel,
  btnSearchFloat,
  showControls,
  showTable,
  tableRules,
  spanMethod,
  headerCellStyle,
  highlight,
  defaultExpandAll,
  rowKey,
  treeProps,
  showSummary,
  summaryMethod,
  rowClassName,
  showMultipleChecked,
  customId,
  hasLeftPart,
  showSearchControlsBtn,
  showSearchBtn,
  showDefaultControlsRight,
  showPagination,
  scrollbarAlwaysOn,
  pageSize,
  pageSizes,
} = toRefs(props)

const emit = defineEmits([
  'search-model-change',
  'checked-item-change',
  'table-mounted',
  'current-change',
  'row-click',
  'remove-success',
  'search-model-reset',
  'after-fetch-data',
])

const searchFormRef = ref()
const tableRef = ref()
const tableFormRef = ref()
const loading = ref(true)
const checkedItems = ref<any>([])
const totalRecord = ref(0)
const showAdvancedSearch = ref(false)
const defaultTableHeight = ref(300)
const defaultMaxHeight = ref(650)
// 页面开始加载时不监听查询条件变化，解决刚进页面加载两次的问题
const startWatchSearchModel = ref(false)

const tableModel = reactive({
  tableData: [],
})
const searchModel = reactive({})
const sortInfo = reactive({
  sortBy: '',
  sortType: '',
})

const pageInfo = reactive({
  currentPage: 1,
  pageSize: pageSize.value,
  summaryRecord: {},
})

const tableData = computed<any>({
  get() {
    return tableModel.tableData
  },
  set(value) {    tableModel.tableData = value
  },
})

watch(
  baseSearchModel,
  (value) => {
    Object.assign(searchModel, _.clone(value))
  },
  { deep: true, immediate: true },
)

watch(
  searchModel,
  _.debounce((newValue) => {
    emit('search-model-change', newValue)
    if (startWatchSearchModel.value && props.fetchDataWhileConditionChange) {
      /* console.log('search-model-change', newValue, oldValue)*/
      fetchData()
    }
  }, 500),
  { deep: true },
)

watch(
  checkedItems,
  (value) => {
    emit('checked-item-change', value)
  },
  { deep: true },
)

watch(showTable, (value) => {
  if (value) {
    nextTick(() => {
      /* tableRef.value.doLayout();*/
      setTableHeight()
    })
  }
})

onMounted(() => {
  startWatchSearchModel.value = false
  if (props.autoFetch) {
    fetchData()
  } else {
    loading.value = false
    startWatchSearchModel.value = true
  }
  Object.assign(pageInfo, sortInfo)
  if (showTable.value) {
    nextTick(() => {
      if (tableRef.value) {
        tableRef.value.doLayout()
      }
      setTableHeight()
      // noinspection JSValidateTypes
      window.onresize = _.debounce(() => {
        if (tableRef.value) {
          tableRef.value.doLayout()
        }
      }, 300)
    })
  }
  emit('table-mounted')
})

onUnmounted(() => {
  window.onresize = null
})

function setTableHeight() {
  if (showTable.value) {
    if (props.fixedHeight) {
      defaultTableHeight.value = props.fixedHeight
      return
    }
    let bottomOffset
    let topOffset
    if (props.bottomOffsetHeight === -1) {
      bottomOffset = props.showPagination ? 68 : 25
    } else {
      bottomOffset = props.bottomOffsetHeight
    }
    if (props.maxHeight === -1 && props.tableHeight === -1) {
      if (props.topOffsetHeight === -1) {
        topOffset = tableRef.value.$el.getBoundingClientRect().top
      } else {
        topOffset = props.topOffsetHeight
      }
      if (tableRef.value.$el) {
        defaultTableHeight.value = window.innerHeight - topOffset - bottomOffset
        defaultMaxHeight.value = defaultTableHeight.value
        if (defaultTableHeight.value < 300) {
          defaultTableHeight.value = defaultMaxHeight.value = 300
        }
      }
    }
    if (props.maxHeight !== -1) {
      defaultMaxHeight.value = props.maxHeight
    }
    if (props.tableHeight !== -1) {
      defaultTableHeight.value = props.tableHeight
    }
  }
}

function handleSortChange({ column, prop, order }) {
  if (column.sortable !== 'custom') {
    return
  }
  sortInfo.sortType = ''
  sortInfo.sortBy = ''
  if (!_.isNull(order)) {
    sortInfo.sortType = order.replace('ending', '')
    sortInfo.sortBy = prop
    if ($utils.isNotEmpty(column.sortBy)) {
      sortInfo.sortBy = column.sortBy
      if (_.isArray(column.sortBy)) {
        sortInfo.sortBy = column.sortBy.join(',')
      }
    }
  }
  nextTick(() => {
    fetchData()
  })
}
// 行点击
function rowClick(rowData) {
  emit('row-click', rowData)
}

function clearSelection() {
  /* clearSelection();*/
}

// 单选时改变当前值
function currentChange(currentRow, oldCurrentRow) {
  emit('current-change', currentRow, oldCurrentRow)
}

/**
 * 单个选中
 */
function checkedOne(selection, row) {
  const customId = props.customId
  let isExist
  const isChecked = selection.some((item) => {
    return item[customId] === row[customId]
  })
  // findIndex(selection, row) >= 0;
  // 判断是否选中
  if (!isChecked) {
    for (let i = 0; i < checkedItems.value.length; i++) {
      if (checkedItems.value[i][customId] === row[customId]) {
        checkedItems.value.splice(i, 1)
        break
      }
    }
  } else {
    // 判断是否存在
    isExist = checkedItems.value.some((item) => {
      return item[customId] === row[customId]
    })
    if (!isExist) {
      checkedItems.value.push(row)
    }
  }
}

/**
 * 全选
 */
function checkedAll(selection) {
  if (selection.length > 0) {
    selection.map((item) => {
      // 逐个选中
      checkedOne(selection, item)
    })
  } else {
    tableData.value.map((item) => {
      // 逐个取消
      checkedOne([], item)
    })
  }
}

/**
 * 删除选中项
 */
function removeCheckedItem(item) {
  const customId = props.customId
  for (let i = 0; i < checkedItems.value.length; i++) {
    if (checkedItems.value[i][customId] === item[customId]) {
      tableRef.value.toggleRowSelection(item, false)
      for (let j = 0; j < tableData.value.length; j++) {
        if (tableData.value[j][customId] === item[customId]) {
          tableRef.value.toggleRowSelection(tableData.value[j], false)
          break
        }
      }
      checkedItems.value.splice(i, 1)
      break
    }
  }
}

/**
 * 删除所有选中项
 */
function removeAllCheckedItem() {
  const customId = props.customId
  for (let i = 0; i < checkedItems.value.length; i++) {
    tableRef.value.toggleRowSelection(checkedItems.value[i], false)
    for (let j = 0; j < tableData.value.length; j++) {
      if (tableData.value[j][customId] === checkedItems.value[i][customId]) {
        tableRef.value.toggleRowSelection(tableData.value[j], false)
        break
      }
    }
    checkedItems.value.splice(i, 1)
    i--
  }
}

/**
 * 初始化选中项
 */
function initRecordChecked() {
  // 很奇怪，checkedItems 和 tableData 的值一样，但是就是用不了checkedItems 的数据
  for (let i = 0; i < checkedItems.value.length; i++) {
    for (let j = 0; j < tableData.value.length; j++) {
      if (checkedItems.value[i][props.customId] === tableData.value[j][props.customId]) {
        tableRef.value.toggleRowSelection(tableData.value[j], true)
        break
      }
    }
  }
}

/**
 * 编辑
 */
function edit(id) {
  if (!props.editPath) {
    $utils.messageUtils.message.error('编辑失败，因为对应的Action没有设置')
    return
  }
  router.push({ path: props.editPath + '/' + id })
}
/**
 * 删除
 */
async function remove(id) {
  try {
    const customId = props.customId
    if (!props.removeAction) {
      return $utils.messageUtils.showResponseErrorMessage('删除失败，因为对应的Action没有设置！')
    }
    await MessageBox.confirm('确定删除该记录?', '提示', {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      type: 'warning',
    })
    loading.value = true
    const removeActionExecutor = commonUtils.isEmpty(props.removeActionUrl)
      ? props.removeAction(id)
      : props.removeAction(props.removeActionUrl, id)
    return removeActionExecutor
      .then((res) => {
        if (!res.success) {
          return $utils.messageUtils.showResponseErrorMessage(res.message)
        }
        for (let i = 0; i < tableData.value.length; i++) {
          if (tableData.value[i][customId] === id) {
            tableData.value.splice(i, 1)
            i++
          }
        }
        if (tableData.value.length > 0) {
          fetchData()
        } else {
          fetchData(pageInfo.currentPage - 1 || 1)
        }
        $utils.messageUtils.message.success(`删除数据成功`)
        emit('remove-success')
      })
      .catch((e) => {
        return $utils.messageUtils.showResponseErrorMessage(e.message)
      })
      .finally(() => {
        loading.value = false
      })
  } catch (e) {
    return Promise.reject(e)
  }
}

/**
 * 批量删除
 */
function removeBatch() {
  const customId = props.customId
  const ids = checkedItems.value.map((item) => {
    return item[customId]
  })

  if (!props.removeBatchAction) {
    $utils.messageUtils.message.error('删除失败，因为对应的Action没有设置')
    return
  }

  if (ids.length === 0) {
    $utils.messageUtils.message.warning('请选择数据')
    return
  }

  $utils.messageUtils
    .confirm('确定要删除选中的数据？')
    .then((action) => {
      if (action === 'confirm') {
        loading.value = true
        props
          .removeBatchAction(ids)
          .then(() => {
            // 删除当前表格里面的数据
            for (let i = 0; i < tableData.value.length; i++) {
              for (let j = 0; j < ids.length; j++) {
                if (tableData.value[i][customId] === ids[j]) {
                  tableData.value.splice(i, 1)
                  i--
                  break
                }
              }
            }
            // 删除选中的数据
            checkedItems.value = []

            loading.value = false
            $utils.messageUtils.message.success(`删除数据成功`)
            emit('remove-success')
          })
          .catch(() => {
            $utils.messageUtils.message.error(`删除数据失败`)
          })
      }
    })
    .catch(() => {})
}

/**
 * 获取数据
 * @param pageIndex
 */
function fetchData(pageIndex?) {
  tableData.value = []
  Object.assign(pageInfo, sortInfo)

  if (!props.getAction) {
    $utils.messageUtils.message.error('获取数据失败，因为对应的Action没有设置')
    return
  }

  pageInfo.currentPage = pageIndex || pageInfo.currentPage || 1
  if (!props.showPagination) {
    pageInfo.pageSize = props.noPageSize
  }
  const condition = getSearchCondition()
  if (props.beforeFetchData && typeof props.beforeFetchData === 'function' && !props.beforeFetchData(condition)) {
    return
  }
  loading.value = true
  const callback = (res) => {
    if (_.has(res, 'success') && !res.success) {
      throw res
    }
    // 处理数据
    if (props.formatData && typeof props.formatData === 'function') {
      tableData.value = props.formatData(res.records)
    } else {
      tableData.value = res.records
    }
    if (res.records !== undefined && $utils.isNotEmpty(res.records)) {
      totalRecord.value = res.totalRecord || res.records.length
    } else {
      totalRecord.value = 0
    }
    pageInfo.summaryRecord = res.summaryRecord

    // 设置已选择项目
    nextTick(() => {
      initRecordChecked()
      if (showTable.value && tableRef.value) {
        tableRef.value.doLayout()
      }
      if (props.afterFetchData && typeof props.afterFetchData === 'function') {
        props.afterFetchData(tableData.value)
      }
      emit('after-fetch-data', tableData.value)
      if (showTable.value && tableRef.value) {
        tableRef.value.setScrollTop(0)
      }
    })

    loading.value = false
    // 第一次查询后，开始监听查询条件变化
    if (!startWatchSearchModel.value) {
      setTimeout(() => {
        startWatchSearchModel.value = true
      }, 1000)
    }
  }
  if (props.getAction && typeof props.getAction === 'function') {
    const getActionExecutor = commonUtils.isEmpty(props.actionUrl)
      ? props.getAction(condition, pageInfo)
      : props.getAction(props.actionUrl, condition, pageInfo)
    // 请求数据
    return getActionExecutor.then(callback).catch((error) => {
      let errorMsg = '获取数据列表失败'
      if ($utils.isNotEmpty(error.message)) {
        errorMsg = errorMsg.concat(`：${error.message}`)
      }
      $utils.messageUtils.message.error(errorMsg)
      loading.value = false
      if (props.afterFetchData && typeof props.afterFetchData === 'function') {
        props.afterFetchData(tableData.value)
      }
    })
  }
}

/**
 * 获取请求的参数
 */
function getSearchCondition() {
  const condition = {}
  if (props.disabledRemoteConditionQuery) {
    return condition
  }
  // 基础搜索
  for (const key in searchModel) {
    if (Object.prototype.hasOwnProperty.call(searchModel, key)) {
      const value = searchModel[key]
      if (value !== undefined && value !== '' && value !== null && value.length !== 0) {
        condition[key] = searchModel[key]
      }
    }
  }
  // 添加自定义条件
  const extraCondition = typeof props.getExtraCondition === 'function' ? props.getExtraCondition() : {}
  // 添加自定义条件
  Object.assign(condition, props.getActionWhere, extraCondition)
  return condition
}

/**
 * 重置查询条件
 */
function reset() {
  const emptyProps = _(searchModel)
    .omit(_.keys(props.baseSearchModel))
    .forIn((val, key, obj) => (obj[key] = ''))
  Object.assign(searchModel, _.clone(props.baseSearchModel), emptyProps)
  emit('search-model-reset')
}

/**
 * 分页改变事件
 */
function handleSizeChange(val) {
  pageInfo.pageSize = val
  fetchData(1)
}

/**
 * 查找, 点击事件
 */
function search() {
  fetchData(1)
}

/**
 * 插入一行
 * */
function insertRow(newRow = { id: '' }) {
  // noinspection JSValidateTypes
  tableData.value = [newRow, ...tableData.value]
  totalRecord.value++
  nextTick(() => {
    tableRef.value.setScrollTop(0)
  })
}
/**
 * 删除一行
 * */
function deleteRow(rowData) {
  const idx = _.findIndex(tableData.value, { id: rowData.id })
  tableData.value.splice(idx, 1)
  totalRecord.value--
}
/**
 * 高亮
 */
function setCurrentRow(index) {
  tableRef.value.setCurrentRow(index)
}

/**
 * 获取行数据
 * */
function getRowData(id) {
  return _.find(tableData.value, { id }) as any
}

/**
 * 设置行数据
 * */
function setRowData(id, newData) {
  const rowData = getRowData(id)
  Object.assign(rowData, newData)
}

function openAdvancedSearch() {
  showAdvancedSearch.value = !showAdvancedSearch.value
  nextTick(() => {
    setTableHeight()
  })
}

/**
 * 导出
 * */
function exportTable() {
  ExcelUtils.exportList(tableRef.value.$el, props.exportFileName || props.name)
}

/**
 * 打印
 * */
function printTable() {
  ExcelUtils.printHTML(tableRef.value.$el)
}
function clearValidate() {
  setTimeout(() => {
    tableFormRef.value?.clearValidate()
  }, 100)
}

function getLoading(flag) {
  loading.value = flag
}
defineExpose({
  checkedItems,
  clearValidate,
  deleteRow,
  edit,
  exportTable,
  fetchData,
  getLoading,
  getRowData,
  insertRow,
  pageInfo,
  printTable,
  remove,
  removeAllCheckedItem,
  removeBatch,
  reset,
  search,
  searchFormRef,
  searchModel,
  setCurrentRow,
  setRowData,
  startWatchSearchModel,
  tableData,
  tableFormRef,
})
</script>

<style lang="scss" scoped src="./style.scss"></style>
<style lang="scss">
.cursor_default {
  cursor: default !important;
}
.cursor_move {
  cursor: move !important;
}
.w-table {
  position: relative;
  .dragging_column {
    &::after {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.1) !important;
      cursor: move !important;
      content: '';
    }
  }
  .drag_active_left.drag_cur {
    &::after {
      position: absolute;
      left: 1px;
      top: 0;
      border-left: 1px dotted #666 !important;
      width: 1px;
      height: 100%;
      content: '';
    }
  }
  .drag_active_right.drag_cur {
    &::after {
      position: absolute;
      right: 0;
      top: 0;
      border-right: 1px dotted #666 !important;
      width: 1px;
      height: 100%;
      content: '';
    }
  }
  .el-table {
    th {
      .caret-wrapper {
        width: 12px;
        cursor: pointer;
        .sort-caret {
          left: 3px;
        }
      }
    }
    td {
      .el-button + .el-button {
        margin-left: 10px;
      }
    }
    .fixed-t {
      top: 0 !important;
    }
  }
}
.controls-center {
  position: absolute;
  left: 50%;
  top: 50%;
  font-weight: bold;
  font-size: 18px;
  transform: translate(-50%, -50%);
}
.el-pagination {
  padding: 0 5px;
}
.m-search-filter .button.el-button {
  vertical-align: top;
}
.sub-item {
  .sub-con {
    .m-table-comb {
      .el-table {
        &--border,
        &--group {
          border-color: var(--el-table-border-color);
        }
        &__empty-block {
          border-color: #ebeef5;
        }
        th {
          background: #f4f5f6 !important;
          &.is-leaf {
            border-color: var(--el-table-border-color) !important;
          }
        }
        td {
          border-color: var(--el-table-border-color);
        }
      }
    }
  }
}
</style>
