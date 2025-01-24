// noinspection TypeScriptValidateJSTypes

import { ElLoading as Loading } from 'element-plus'

interface IPageOptions {
  summaryOptions?: ISummaryOptions
}

interface ISummaryOptions {
  summaryFields?: string[]
  getSummaryOptions?: () => string[]
  nonSummaryFields?: string[]
  getNonSummaryFields?: () => string[]
  intFields?: string[]
  getIntFields?: () => string[]
  avgFields?: string[]
  getAvgFields?: () => string[]
  rowspanFields?: string[]
  getRowspanFields?: () => string[]
  columnProps?: any
}

const summaryMethod = ({
  summaryFields = [],
  getSummaryOptions = undefined,
  nonSummaryFields = [],
  getNonSummaryFields = undefined,
  intFields = [],
  getIntFields = undefined,
  avgFields = [],
  getAvgFields = undefined,
  rowspanFields = [],
  getRowspanFields = undefined,
  /**
   * {
   *   xxx: {
   *     formatter() {...},
   *     precision: 2
   *   }
   * }
   * */
  columnProps = {},
}: ISummaryOptions = {}) => {
  return function (param) {
    const { columns, data } = param
    if (data.length === 0) {
      return []
    }
    if (typeof getSummaryOptions === 'function') {
      summaryFields = getSummaryOptions()
    }
    if (typeof getNonSummaryFields === 'function') {
      nonSummaryFields = getNonSummaryFields()
    }
    if (typeof getIntFields === 'function') {
      intFields = getIntFields()
    }
    if (typeof getAvgFields === 'function') {
      avgFields = getAvgFields()
    }
    if (typeof getRowspanFields === 'function') {
      rowspanFields = getRowspanFields()
    }
    const sumArr = columns.map((column, index) => {
      const { precision = 2, showEmpty = true } = columnProps[column.property] || {}
      if (index === 0) {
        return '合计'
      }
      if (!_.includes(summaryFields, column.property)) {
        return ''
      }
      if (_.includes(nonSummaryFields, column.property)) {
        return ''
      }
      let sum = 0
      if (_.includes(rowspanFields, column.property)) {
        /* sum = $utils.numberUtils.sum(_.values(this.deptTotalAmtMap), 2);*/
      } else {
        sum = $utils.numberUtils.sum(
          data.map((item) => Number(item[column.property] || 0)),
          precision,
        )
      }
      if (_.includes(intFields, column.property)) {
        return parseInt(sum.toString())
      }
      if (_.includes(avgFields, column.property)) {
        return $utils.numberUtils.div(sum, data.length, precision)
      }
      return $filters.thousandSeparator(sum, { showEmpty, precision })
    })
    let sumObj = {}
    if (columns.length > 0) {
      sumObj = Object.assign.apply(
        null,
        // @ts-ignore
        _.map(columns, (column, index) => ({ [column.property]: sumArr[index] })),
      )
    }
    return columns.map((column, index) => {
      const { formatter = undefined } = columnProps[column.property] || {}
      const value = sumArr[index]
      if (typeof formatter === 'function') {
        sumArr[index] = formatter({ value, sumObj, sumArr, data })
        return sumArr[index]
      }
      return value
    })
  }
}

export const useBasePage = function (options: IPageOptions = { summaryOptions: {} }) {
  const route = useRoute()
  const store = useStore()

  const tableRef = ref()
  const formRef = ref()
  const title = ref(route.meta.title)

  async function add() {
    await formRef.value.open()
  }

  async function edit(id) {
    await formRef.value.open(id)
  }

  function remove(id) {
    tableRef.value.remove(id)
  }

  function fetchData() {
    tableRef.value.fetchData()
  }

  function onSaveSuccess() {
    fetchData()
  }

  const extendColumnCodeProps = (columnName, typeCode, config) => {
    const callback = (data) =>
      $utils.mapKeyValue(store.code.lists[typeCode], 'value', (item) => Object.assign(item, config[item.value]))[
        data[columnName]
      ]
    return $utils.mapKeyValue(tableRef.value.tableData, 'id', callback)
  }

  const tableData = computed(() => tableRef.value?.tableData || [])

  const searchModel = computed(() => tableRef.value?.searchModel || {})

  provide('getTableData', () => tableData.value)

  return {
    formRef,
    tableRef,
    title,
    tableData,
    searchModel,
    add,
    edit,
    remove,
    fetchData,
    onSaveSuccess,
    extendColumnCodeProps,
    summaryMethod: summaryMethod(options.summaryOptions),
  }
}

interface IEditPageOptions extends IPageOptions {
  defaultRowData: any
  saveAction?: (id) => any
  saveListAction?: (list) => any
  getSaveData?: (rowData) => any
  getSaveListData?: () => any
  formatRowData?: (rowData) => void
  beforeAdd?: (rowData) => void
  beforeAddDone?: (rowData) => void
  afterAdd?: (rowData) => void
  beforeEdit?: (rowData) => void
  beforeEditDone?: (rowData) => void
  afterEdit?: (rowData) => void
  beforeSave?: (rowData) => void
  beforeSaveList?: () => void
  afterSave?: (rowData) => void
  afterSaveList?: () => void
  enableFetchDataAfterSave?: boolean
  beforeRemove?: (rowData) => void
  afterRemove?: (rowData) => void
}

export const useBaseEditPage = function (
  options: IEditPageOptions = {
    defaultRowData: {},
    summaryOptions: {},
  },
) {
  const {
    defaultRowData,
    saveAction,
    saveListAction,
    getSaveData,
    getSaveListData,
    formatRowData,
    beforeAdd,
    beforeAddDone,
    afterAdd,
    beforeEdit,
    beforeEditDone,
    afterEdit,
    beforeSave,
    beforeSaveList,
    afterSave,
    afterSaveList,
    enableFetchDataAfterSave = true,
    beforeRemove,
    afterRemove,
  } = options
  const route = useRoute()
  const title = ref(route.meta.title)
  const tableRef = ref()
  const originRowDataMap = ref({})

  const tableData = computed(() => tableRef.value?.tableData || [])

  const saveListDisabled = computed(() => {
    if (typeof saveListAction === 'function') {
      return !_.some(tableData.value, (rowData) => rowData.editMode)
    }
  })

  async function onCellClick(rowData) {
    await edit(rowData)
  }

  /**
   * 获取数据
   * */
  function fetchData() {
    tableRef.value.fetchData()
  }

  /**
   * 格式化表格数据
   * */
  function formatData(tableData) {
    return _.map(tableData, (rowData) => {
      if (typeof formatRowData === 'function') {
        rowData = formatRowData(rowData)
      }
      return {
        ...rowData,
        editMode: false,
      }
    })
  }

  /**
   * 新增
   * */
  async function add() {
    revertUnchangedRow()
    const rowData = {
      ...defaultRowData,
      id: '',
      rowState: Constants.rowState.ADDED,
      editMode: true,
    }
    if (typeof beforeAdd === 'function') {
      beforeAdd(rowData)
    }
    if (typeof beforeAddDone === 'function') {
      await doLoading(async () => {
        await beforeAddDone(rowData)
      })
    }
    // 新增行
    tableRef.value.insertRow(rowData)
    if (typeof afterAdd === 'function') {
      afterAdd(rowData)
    }
    await nextTick(() => {
      scrollToTop()
    })
  }

  /**
   * 编辑
   * */
  async function edit(rowData) {
    if (rowData.editMode) {
      return
    }
    revertUnchangedRow()
    if (typeof beforeEdit === 'function') {
      beforeEdit(rowData)
    }
    if (typeof beforeEditDone === 'function') {
      await doLoading(async () => {
        beforeEditDone(rowData)
      })
    }
    originRowDataMap.value[rowData.id] = _.cloneDeep(rowData)
    tableRef.value.setRowData(rowData.id, {
      ...rowData,
      rowState: Constants.rowState.MODIFIED,
      editMode: true,
    })
    if (typeof afterEdit === 'function') {
      afterEdit(rowData)
    }
  }

  /**
   * 加载中
   * */
  async function doLoading(callback) {
    const loading = Loading.service({
      target: '.table-content',
      background: 'rgba(255,255,255,.3)',
    })
    await callback()
    loading.close()
  }

  /**
   * 恢复未修改的行
   * */
  function revertUnchangedRow() {
    const editingRows = _.filter(tableData.value, { editMode: true })
    _.each(editingRows, (row) => {
      if (
        _.isEqual(
          row,
          _.assign({}, originRowDataMap.value[row.id], { editMode: true, rowState: Constants.rowState.MODIFIED }),
        )
      ) {
        cancel(row)
      }
    })
  }

  /**
   * 保存
   * */
  async function save(rowData) {
    if (typeof beforeSave === 'function') {
      beforeSave(rowData)
    }
    tableRef.value.tableFormRef.validate(async (valid) => {
      if (valid) {
        if (getDefaultSaveListData().length > 1) {
          await $utils.messageUtils.confirm('多条记录处于编辑状态，是否批量保存？')
          await saveList()
          return
        }
        await $utils.onLoading(
          async () => {
            const requestData = typeof getSaveData === 'function' ? getSaveData(rowData) : rowData
            const res = await saveAction!(requestData)
            await $utils.messageUtils.showResponseMessage(res)
            tableRef.value.setRowData(rowData.id, {
              id: res.info,
              rowState: Constants.rowState.UNCHANGED,
              editMode: false,
            })
            if (typeof afterSave === 'function') {
              afterSave(rowData)
            }
            if (enableFetchDataAfterSave) {
              fetchData()
            }
          },
          { text: '正在保存数据，请稍候...' },
        )
      }
    })
  }

  async function saveList() {
    if (typeof saveListAction !== 'function') {
      return $utils.messageUtils.message.error('未配置批量保存路径，保存失败！')
    }
    if (typeof beforeSaveList === 'function') {
      beforeSaveList()
    }
    tableRef.value.tableFormRef.validate(async (valid) => {
      if (valid) {
        await $utils.onLoading(
          async () => {
            const requestData = typeof getSaveListData === 'function' ? getSaveListData() : getDefaultSaveListData()
            const res = await saveListAction(requestData)
            await $utils.messageUtils.showResponseMessage(res)
            if (typeof afterSaveList === 'function') {
              afterSaveList()
            }
            if (enableFetchDataAfterSave) {
              fetchData()
            }
          },
          { text: '正在保存数据，请稍候...' },
        )
      }
    })
  }

  function getDefaultSaveListData() {
    return tableData.value.filter((rowData) => rowData.editMode === true)
  }

  /**
   * 取消
   * */
  function cancel(rowData) {
    if (_.isEmpty(rowData.id)) {
      tableRef.value.deleteRow(rowData)
      return
    }
    tableRef.value.setRowData(rowData.id, originRowDataMap.value[rowData.id])
  }

  /**
   * 删除
   * */
  async function remove(rowData) {
    try {
      if (getDefaultSaveListData().length > 0) {
        await $utils.messageUtils.message.error('请先保存正在编辑的数据！')
        return
      }
      if (typeof beforeRemove === 'function') {
        beforeRemove(rowData)
      }
      await tableRef.value.remove(rowData.id)
      if (typeof afterRemove === 'function') {
        afterRemove(rowData)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function scrollToTop() {
    await nextTick(() => {
      const scrollContainer = tableRef.value.$el.querySelector('.el-table__body-wrapper')
      scrollContainer.scrollTop = 0
    })
  }

  return {
    tableRef,
    title,
    saveListDisabled,
    tableData,
    formatData,
    add,
    edit,
    save,
    saveList,
    remove,
    cancel,
    fetchData,
    onCellClick,
    summaryMethod: summaryMethod(options.summaryOptions),
  }
}
