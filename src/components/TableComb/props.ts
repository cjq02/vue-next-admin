export const baseProps = {
  actionUrl: {
    default: '',
    type: String,
  },

  afterFetchData: {
    default: null,
    type: Function,
  },

  /**
   * 是否自动加载数据
   * */
  autoFetch: {
    default: true,
    type: Boolean,
  },
  autoHeight: {
    default: false,
    type: Boolean,
  },

  baseSearchModel: {
    default: () => {
      return {}
    },
    type: Object,
  },

  beforeFetchData: {
    default: null,
    type: Function,
  },
  bottomOffsetHeight: {
    default: -1,
    type: Number,
  },
  btnSearchFloat: {
    default: '',
    type: String,
  },
  // 显示给用户的名字
  checkedDisplayName: {
    default: 'name',
    type: String,
  },

  // 自定义id
  customId: {
    default: 'id',
    type: String,
  },

  defaultExpandAll: {
    default: false,
    type: Boolean,
  },

  /**
   * 行参数
   * */
  defaultRowData: {
    default: () => {},
    type: Object,
  },
  /**
   * 禁用远程条件查询（分页下不能禁用此参数）
   * */
  disabledRemoteConditionQuery: {
    default: false,
    type: Boolean,
  },

  editPath: {
    default: '',
    type: String,
  },
  /**
   * 全部导出url
   */
  excelExportUrl: {
    default: '',
    type: String,
  },

  existsAdvancedSearch: {
    default: false,
    type: Boolean,
  },
  /**
   * 导出文件名
   */
  exportFileName: {
    default: '',
    type: String,
  },
  /**
   * 自动查询
   * */
  fetchDataWhileConditionChange: {
    default: true,
    type: Boolean,
  },
  /**
   * 固定高度
   * */
  fixedHeight: {
    default: 0,
    type: Number,
  },
  formatData: {
    default: null,
    type: Function,
  },
  getAction: {
    default: null,
    type: Function,
  },

  getActionWhere: {
    default: () => ({}),
    type: Object,
  },
  /**
   * 附加的查询条件
   * */
  getExtraCondition: { default: null, type: Function },

  hasLeftPart: {
    default: false,
    type: Boolean,
  },

  /**
   * 表头样式
   * */
  headerCellStyle: {
    default: null,
    type: Function,
  },

  /**
   * 是否高亮
   * */
  highlight: {
    default: false,
    type: Boolean,
  },

  listPath: {
    default: '',
    type: String,
  },

  maxHeight: {
    default: -1,
    type: Number,
  },
  name: {
    default: '',
    type: String,
  },
  noPageSize: {
    default: -1,
    type: Number,
  },

  pageSize: {
    default: 100,
    type: Number,
  },

  /**
   * 页码
   */
  pageSizes: {
    default: [10, 20, 50, 100, 200, 500, 1000, 1500, 2000],
    type: Array,
  },

  /**
   * 删除方法
   */
  removeAction: {
    default: null,
    type: Function,
  },

  /**
   * 删除地址
   */
  removeActionUrl: {
    default: '',
    type: String,
  },

  /**
   * 批量删除方法
   */
  removeBatchAction: {
    default: null,
    type: Function,
  },
  rowClassName: {
    default: null,
    type: Function,
  },

  rowKey: {
    default: '',
    type: String,
  },

  /**
   * 展示滚动条
   * */
  scrollbarAlwaysOn: {
    default: false,
    type: Boolean,
  },

  /**
   * 是否有新增按钮
   * */
  showAdd: {
    default: false,
    type: Boolean,
  },

  /**
   * 是否有控制按钮
   * */
  showControls: {
    default: true,
    type: Boolean,
  },

  /**
   * 是否有导出打印隐藏查询按钮
   * */
  showDefaultControlsRight: {
    default: true,
    type: Boolean,
  },
  /**
   * 全部导出按钮是否显示
   */
  showExportAllBtn: {
    default: false,
    type: Boolean,
  },

  showMultipleChecked: {
    default: true,
    type: Boolean,
  },
  /**
   * 是否分页
   * */
  showPagination: {
    default: true,
    type: Boolean,
  },

  showSearchBtn: {
    default: true,
    type: Boolean,
  },

  /**
   * 是否显示查询按钮
   * */
  showSearchControlsBtn: {
    default: true,
    type: Boolean,
  },

  /**
   * 是否有基础查询
   * */
  showSearchForm: {
    default: true,
    type: Boolean,
  },

  /**
   * 合计
   * */
  showSummary: {
    default: false,
    type: Boolean,
  },
  /**
   * 是否展示表格
   * */
  showTable: {
    default: true,
    type: Boolean,
  },
  spanMethod: {
    default: null,
    type: Function,
  },

  summaryMethod: {
    default: null,
    type: Function,
  },

  tableHeight: {
    default: -1,
    type: Number,
  },
  tableRules: {
    default: () => {
      return {}
    },
    type: Object,
  },

  topOffsetHeight: {
    default: -1,
    type: Number,
  },

  treeProps: {
    default: () => {
      return { children: 'children', hasChildren: 'hasChildren' }
    },
    type: Object,
  },
}
