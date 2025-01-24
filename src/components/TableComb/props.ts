export const baseProps = {
  name: {
    type: String,
    default: '',
  },
  getAction: {
    type: Function,
    default: null,
  },
  actionUrl: {
    type: String,
    default: '',
  },
  getActionWhere: {
    type: Object,
    default: () => ({}),
  },
  /**
   * 附加的查询条件
   * */
  getExtraCondition: { type: Function, default: null },
  /**
   * 删除方法
   */
  removeAction: {
    type: Function,
    default: null,
  },
  /**
   * 删除地址
   */
  removeActionUrl: {
    type: String,
    default: '',
  },
  /**
   * 批量删除方法
   */
  removeBatchAction: {
    type: Function,
    default: null,
  },
  /**
   * 是否有基础查询
   * */
  showSearchForm: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否显示查询按钮
   * */
  showSearchButton: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否有控制按钮
   * */
  showControls: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否展示表格
   * */
  showTable: {
    type: Boolean,
    default: true,
  },
  /**
   * 行参数
   * */
  defaultRowData: {
    type: Object,
    default: () => {},
  },
  /**
   * 是否有新增按钮
   * */
  showAdd: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否有导出打印隐藏查询按钮
   * */
  showDefaultControlsRight: {
    type: Boolean,
    default: true,
  },
  /**
   * 自定义id
   * */
  customId: {
    type: String,
    default: 'id',
  },
  /**
   * 显示给用户的名字
   * */
  checkedDisplayName: {
    type: String,
    default: 'name',
  },
  editPath: {
    type: String,
    default: '',
  },
  listPath: {
    type: String,
    default: '',
  },
  baseSearchModel: {
    type: Object,
    default: () => {
      return {}
    },
  },
  /**
   * 是否自动加载数据
   * */
  autoFetch: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否高亮
   * */
  highlight: {
    type: Boolean,
    default: false,
  },
  beforeFetchData: {
    type: Function,
    default: null,
  },
  afterFetchData: {
    type: Function,
    default: null,
  },
  formatData: {
    type: Function,
    default: null,
  },
  spanMethod: {
    type: Function,
    default: null,
  },
  summaryMethod: {
    type: Function,
    default: null,
  },
  rowClassName: {
    type: Function,
    default: null,
  },
  /**
   * 是否分页
   * */
  showPagination: {
    type: Boolean,
    default: true,
  },
  showMultipleChecked: {
    type: Boolean,
    default: true,
  },
  hasLeftPart: {
    type: Boolean,
    default: false,
  },
  btnSearchFloat: {
    type: String,
    default: '',
  },
  existsAdvancedSearch: {
    type: Boolean,
    default: false,
  },
  defaultExpandAll: {
    type: Boolean,
    default: false,
  },
  rowKey: {
    type: String,
    default: '',
  },
  treeProps: {
    type: Object,
    default: () => {
      return { hasChildren: 'hasChildren', children: 'children' }
    },
  },
  /**
   * 页码
   */
  pageSize: {
    type: Number,
    default: 20,
  },
  /**
   * 页码
   */
  pageSizes: {
    type: Array,
    default: [10, 20, 50, 100, 500, 1000, 2000],
  },
  noPageSize: {
    type: Number,
    default: -1,
  },
  /**
   * 合计
   * */
  showSummary: {
    type: Boolean,
    default: false,
  },
  bottomOffsetHeight: {
    type: Number,
    default: -1,
  },
  topOffsetHeight: {
    type: Number,
    default: -1,
  },
  /**
   * 固定高度
   * */
  fixedHeight: {
    type: Number,
    default: 0,
  },
  tableRules: {
    type: Object,
    default: () => {
      return {}
    },
  },
  /**
   * 禁用远程条件查询（分页下不能禁用此参数）
   * */
  disabledRemoteConditionQuery: {
    type: Boolean,
    default: false,
  },
  /**
   * 自动查询
   * */
  fetchDataWhileConditionChange: {
    type: Boolean,
    default: true,
  },
  /**
   * 导出文件名
   */
  exportFileName: {
    type: String,
    default: '',
  },
}
