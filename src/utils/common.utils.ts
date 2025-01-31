import { ElLoading as Loading } from 'element-plus'

const apiUrl = import.meta.env.VITE_APP_BASE_API
const serviceUrl = import.meta.env.VITE_APP_BASE_URL

export const getApiUrl = () => apiUrl

export const getBaseUrl = () => serviceUrl + '/' + apiUrl

export const getTimestamp = () => new Date().getTime()

export const getImgUrl = (path) => new URL(`/src/assets/img/${path}`, import.meta.url).href

export async function onLoading(
  callback,
  { target = '.app-container', text = '正在加载数据，请稍候...', disabled = false } = {},
) {
  if (disabled) {
    return callback()
  }
  if (callback) {
    const loading = Loading.service({
      target,
      text,
    })
    const res = await callback().catch(() => loading.close())
    loading.close()
    return res
  }
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const jsonParse = (json) => JSON.parse(JSON.stringify(json))

// noinspection JSCheckFunctionSignatures
/**
 * 生成32位随机码
 * @link https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
 * */
export const generateUUID = () => {
  // @ts-ignore
  return ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  )
}

export function log() {
  let desc = arguments[0]
  let obj
  if (arguments.length === 1) {
    desc = ''
    obj = arguments[0]
  } else if (arguments.length === 2) {
    obj = arguments[1]
  }
  console.log(desc, jsonParse(obj))
}

/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string|null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    a: date.getDay(),
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    m: date.getMonth() + 1,
    s: date.getSeconds(),
    y: date.getFullYear(),
  }
  return format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
}

export const getTransferRate = (loaded, total) => {
  const loadedSize = $utils.numberUtils.div(loaded, 1024 * 1024, 2, { trailingZero: true })
  const totalSize = $utils.numberUtils.div(total, 1024 * 1024, 2, { trailingZero: true })
  return `${loadedSize}MB/${totalSize}MB`
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replace(/\+/g, ' ') +
      '"}',
  )
}
/**
 * 是否为空
 * */
export const isEmpty = (value) => _.isEmpty(value) && !_.isNumber(value) && !_.isDate(value)
/**
 * 是否非空
 * */
export const isNotEmpty = (value) => !isEmpty(value)
/**
 * list转object
 * */
export const mapKeyValue = (list, key, value) => _.mapValues(_.keyBy(list, key), value)
/**
 * list排除选项
 * */
export const excludes = (list, callback) => _.without.apply(null, [list, ..._.filter(list, callback)])
/**
 * 列表转换成对象
 *
 * @param list
 */
export const arrayToObject = (list) => _.extend.apply(null, list) as any
/**
 * 全文替换
 * */
export const replaceAll = (value, origin, target) => value.replace(new RegExp(origin, 'g'), target)
/**
 * 扩展列表码表字段
 * */
export const extendListCodeProps = (list, name, typeCode, config) => {
  const codeStore = useCodeStore()
  const callback = (data) =>
    $utils.mapKeyValue(codeStore.lists[typeCode], 'value', (item) => Object.assign(item, config[item.value]))[
      data[name]
    ]
  return $utils.mapKeyValue(list, 'id', callback)
}
/**
 * 扩展数据码表字段
 * */
export const extendCodeProps = (name, typeCode, config) => {
  const codeStore = useCodeStore()
  return $utils.mapKeyValue(codeStore.lists[typeCode], 'value', (item) => Object.assign(item, config[item.value]))
}
/**
 * 平铺嵌套列表，示例如下：
 * list: [
 *  {a: 1, details: [...]},
 *  {a: 2, details: [...]}
 * ]
 * ==>
 * list: [
 *  {a: 1, ...},
 *  {a: 1, ...},
 *  {a: 2, ...}
 * ]
 * */
export const flattenNestedList = (list, nestedListName) => {
  return _(list)
    .map((item) =>
      item[nestedListName].map((detailItem) => {
        _.forOwn(item, (value, key) => {
          if (_.keys(detailItem).includes(key)) {
            detailItem[`${key}2`] = detailItem[key]
            delete detailItem[key]
          }
        })
        return { ...item, ...detailItem }
      }),
    )
    .flatten()
    .value()
}
/**
 * 清除对象键
 *
 * @param obj
 */
export const clearObject = (obj) => {
  for (const prop of Object.getOwnPropertyNames(obj)) {
    delete obj[prop]
  }
}

/**
 * 关闭页签
 * */
export async function closeTab() {
  const menuStore = useMenuStore()
  const tagsViewStore = useTagsViewStore()
  const router = menuStore.router
  const route = router.currentRoute
  const { visitedViews } = (await tagsViewStore.delView(route)) as any
  const latestView = visitedViews.slice(-1)[0]
  await router.push(latestView.fullPath)
}

/**
 * 关闭当前页签并打开目标页签
 * */
export async function closeTabThenOpenTarget(path) {
  const menuStore = useMenuStore()
  const router = menuStore.router
  await closeTab()
  await router.push({ path })
}

/**
 * 关闭当前页签并刷新新页签
 * */
export async function closeTabThenReloadTarget(path) {
  const menuStore = useMenuStore()
  const tagsViewStore = useTagsViewStore()
  const router = menuStore.router
  const route = router.currentRoute
  await tagsViewStore.delView(route)
  const targetRoute = _.find(tagsViewStore.visitedViews, { path })
  if (targetRoute) {
    await tagsViewStore.delView(targetRoute)
  }
  await router.push({ path })
}

// noinspection SpellCheckingInspection
/**
 * 是否微信内置浏览器
 * */
export function isWeixinBrowser() {
  const ua = navigator.userAgent.toLowerCase()
  return /micromessenger/.test(ua)
}
/**
 * 自定义当前日期时间
 * */
export const getTodayWithTime = (hour, minute, second) => getDateWithTime(new Date(), hour, minute, second)
/**
 * 自定义昨天日期时间
 * */
export const getYesterdayWithTime = (hour, minute, second) =>
  getDateWithTime(dayjs().subtract(1, 'day'), hour, minute, second)
/**
 * 自定义任何日期时间
 * */
export const getDateWithTime = (date, hour, minute, second) => {
  const currentDate = dayjs(date)
  return new Date(currentDate.year(), currentDate.month(), currentDate.date(), hour, minute, second)
}

/**
 * 处理日期范围
 *
 * @param dateRange
 * @param data
 * @param options
 */
export const splitDateRange = (dateRange, data, options?) => {
  const { startDateKey = 'startDate', endDateKey = 'endDate' } = options || {}
  if (commonUtils.isEmpty(dateRange)) {
    Object.assign(data, {
      [endDateKey]: undefined,
      [startDateKey]: undefined,
    })
  } else {
    Object.assign(data, {
      [endDateKey]: new Date(dateRange[1]).getTime(),
      [startDateKey]: new Date(dateRange[0]).getTime(),
    })
  }
}

/**
 * 调用方法
 * */
export const invokeFunction = (method, value: any = null) => {
  if (typeof method === 'function') {
    return { else: () => method(value) }
  }
  return {
    else: (defaultValue) => defaultValue,
  }
}
/**
 * 判断返回值是否响应结果
 * */
export const isResponseResult = (res) => _.has(res, 'success') && _.has(res, 'message') && _.has(res, 'info')
/**
 * 清除对象所有的值
 * */
export const clearObjectValue = (data) => {
  _.forIn(data, (val, key, obj) => (obj[key] = undefined))
}
