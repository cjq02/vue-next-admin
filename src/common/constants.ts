/**
 * 是
 * */
export const TRUE = '1'
/**
 * 否
 * */
export const FALSE = '0'
/**
 * 常量对象
 * */
/**
 * 是
 * */
export const YES = '1'
/**
 * 否
 * */
export const NO = '0'

/**
 * 权限
 * */
export const PERMISSION = {
  /**
   * 删除
   * */
  DEL: 'delete',

  /**
   * 编辑
   * */
  EDIT: 'edit',

  /**
   * 查看
   * */
  VIEW: 'view',
}
/**
 * VO状态
 * */
export const rowState = {
  /**
   * 1 = 新增的状态
   */
  ADDED: 1,
  /**
   * 2 = 删除的状态
   */
  DELETED: 2,
  /**
   * 3 = 修改过的状态
   */
  MODIFIED: 3,

  /**
   * 0 = 未改变状态
   */
  UNCHANGED: 0,
}
/**
 * 表单标识
 * */
export const formFlag = {
  ADD: '新增',
  EDIT: '编辑',
  VIEW: '查看',
}
/**
 * 分页下拉值类型 - 逗号隔开字符串
 */
export const PAGING_SELECT_VALUE_COMMA = 'comma'
/**
 * 分页下拉值类型 - 字符串数组
 */
export const PAGING_SELECT_VALUE_ARRAY = 'array'
/**
 * 码表枚举比较标识
 * */
export const codeCompareFlag = {
  ENUM_VS_CODE: {
    leftTitle: '枚举',
    rightTitle: '码表',
  },
  LOCAL_VS_REMOTE: {
    leftTitle: '前端码表文件列表',
    rightTitle: '数据库码表',
  },
}
/**
 * 系统路径
 */
export const SYSTEM_URL = {
  BASE: '/',
}
