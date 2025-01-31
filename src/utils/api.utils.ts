// noinspection JSUnresolvedVariable

import { ElLoading as Loading } from 'element-plus'

import { doDownload } from '@/utils/libs/download'
import request, * as requestUtils from '@/utils/request'
import TreeUtils from '@/utils/tree.utils'

/**
 * 后端请求context-path
 * */
export const API_PREFIX = '/' + import.meta.env.VITE_APP_BASE_API

/**
 * 附件上传地址
 */
export const UPLOAD_URL = API_PREFIX + '/file/upload.json'
/**
 * 附件下载地址
 */
export const DOWNLOAD_URL = API_PREFIX + '/file/download.json'
/**
 * 上传文件夹路径
 */
export const UPLOAD_DIR_URL = ''
/**
 * 获取文件路径
 *
 * @param url
 */
export const getFullFileUrl = (url) => `${API_PREFIX}/${url.split('/').slice(-2).join('/')}`
/**
 * 下载文件
 * */
export function downloadFile(id, options?) {
  return download('/file/download.json?id=' + id, options)
}
/**
 * 下载文件
 * */
export async function download(url, options?) {
  return doDownload({ url, ...(options || {}) })
}
/**
 * 上传
 * */
export async function upload(url, data) {
  const res = await request({
    data,
    headers: Object.assign({ 'Content-Type': 'multipart/form-data' }, getJwtHeaders()),
    method: 'post',
    timeout: 3600000,
    url,
  })
  return $utils.messageUtils.showResponseMessage(res)
}

/**
 * 额外的jwt headers参数
 */
export const getJwtHeaders = () => requestUtils.getJwtHeaders()

/**
 * 文件预览
 * */
export const getPreviewUrl = (id) => $utils.getApiUrl() + '/file/preview.json?id=' + id
/**
 * 删除文件
 * */
export function removeFile(id) {
  return request({
    method: 'post',
    params: {
      id,
    },
    url: '/file/deleteById.json',
  })
}
/**
 * get 请求
 * */
export function get<Response = any, Request = any>(url, params?: Request) {
  // @ts-ignore
  return request({
    method: 'get',
    params,
    url,
  }) as Promise<Response>
}
/**
 * 获取响应结果信息
 * */
export async function getInfo(url, params) {
  const res = await get(url, params)
  if (_.isUndefined(res.success)) {
    return res
  }
  if (!res.success) {
    $utils.messageUtils.message.error(res.message || '获取数据失败！')
    return null
  }
  return res.info
}
/**
 * post 请求
 * */
export function post<Response = any, Request = any>(url, data: Request) {
  // @ts-ignore
  return request({
    data,
    method: 'post',
    url,
  }) as Promise<Response>
}

/**
 * post 请求（Params）
 * */
export function postParams<Response = any, Request = any>(url, params: Request) {
  // @ts-ignore
  return request({
    method: 'post',
    params,
    url,
  }) as Response
}

/**
 * 获取列表分页-post
 */
export function getPage(url, condition, pageInfo) {
  pageInfo = Object.assign(
    {
      currentPage: 1,
      pageSize: 10,
    },
    pageInfo,
  )
  return request({
    data: {
      condition,
      ...pageInfo,
    },
    method: 'post',
    url: url,
  }) as Promise<any>
}
/**
 * 获取列表 - 基础
 */
export async function getBasePageList(url, params, method) {
  const res = await apiUtils[method](url, params)
  if (_.has(res, 'success')) {
    return res
  }
  return {
    records: res,
  }
}
/**
 * 获取列表
 */
export const getPageList = (url, params, pageInfo) => apiUtils.getBasePageList(url, { ...params, ...pageInfo }, 'get')
/**
 * 获取列表post
 */
export const postPageList = (url, data, pageInfo?) => apiUtils.getBasePageList(url, { ...data, ...pageInfo }, 'post')
/**
 * 根据ID获取数据方法
 * */
export function getAction(url, { idKeyName = 'id' } = {}) {
  return async (keyValue) => {
    const res = await request({
      method: 'get',
      params: {
        [idKeyName]: keyValue,
      },
      url,
    })
    // 兼容，如果没有响应结果，则返回实体数据
    // @ts-ignore
    if (_.isUndefined(res.success)) {
      return res
    }
    // @ts-ignore
    if (!res.success) {
      // @ts-ignore
      await $utils.messageUtils.showResponseErrorMessage(res.message)
    }
    // @ts-ignore
    return res.info
  }
}

/**
 * 删除
 * */
export function remove(url, id, method = 'post') {
  // @ts-ignore
  return request({
    method,
    params: {
      id,
    },
    url: url,
  })
}
/**
 * 删除携带自定义选项
 *
 * @param options
 */
export function removeByOptionsAction(options) {
  const { idKey = 'id', method = 'post' } = options || {}
  return (id, url) => {
    return request({
      method,
      params: {
        [idKey]: id,
      },
      url,
    })
  }
}
/**
 * 根据条件删除
 * */
export function removeByCondition(url, data) {
  return request({
    data,
    method: 'post',
    url,
  })
}
/**
 * 删除方法
 * */
export function removeAction(url) {
  return (id) => remove(id, url)
}
/**
 * 保存
 * */
export async function save(url, data, options = { showLoading: true }) {
  let loading
  if (options.showLoading) {
    loading = Loading.service({
      target: '.app-container',
      text: '正在保存数据，请稍候...',
    })
  }
  return request({
    data,
    method: 'post',
    url,
  }).finally(() => {
    options.showLoading && loading.close()
  })
}
/**
 * 保存方法
 * */
export function saveAction(url) {
  return (data) => save(url, data)
}
/**
 * 获取列表
 */
export function getList(vo, url) {
  return request({
    method: 'get',
    params: {
      ...vo,
    },
    url: url,
  })
}
/**
 * 获取下拉列表
 * */
export async function getSelectList(
  url,
  {
    params = undefined,
    data = undefined,
    condition = undefined,
    method = 'get',
    value = 'id',
    label = 'name',
    getDisabled = (item) => false,
  } = {} as any,
) {
  if (condition) {
    // @ts-ignore
    data = {
      condition,
      pageSize: -1,
    }
  }
  // @ts-ignore
  const res = await request({ data, method, params, url })
  let list: any = []
  if (_.isArray(res)) {
    list = res
  } else {
    // @ts-ignore
    list = res.records
  }

  return _.map(list, (item) =>
    Object.assign(item, {
      disabled: getDisabled(item),
      label: item[label],
      value: item[value],
    }),
  )
}
/**
 * 获取下拉列表
 * */
export function findSelectList(
  url,
  { data = {}, condition = undefined, method = 'post', value = 'id', label = 'name' } = {},
) {
  // @ts-ignore
  return getSelectList(url, { condition, data, label, method, value })
}
/**
 * 获取树下拉列表
 * */
export async function getTreeSelectList(
  url,
  options: any = {
    getDisabled: () => false,
    label: 'name',
    parentId: 'parentId',
    value: 'id',
  },
) {
  const list = await getSelectList(url, _.omit(options, 'getDisabled'))
  return TreeUtils.listToSelectTree(list, options)
}
export function postList(vo, url) {
  return request({
    data: {
      ...vo,
    },
    method: 'post',
    url: url,
  })
}
/**
 * 模版打印-导出1
 * */
export function exportGeneratorHtml(json) {
  const formData = new FormData()
  formData.append('json', json)
  return post<Http.IResponseResult>('/export/generatorHtml.json', formData)
}
/**
 * 模版打印-导出2
 * */
export function exportGeneratorPageHtml(json) {
  const formData = new FormData()
  formData.append('json', json)
  return post<Http.IResponseResult>('/export/generatorPageHtml.json', formData)
}
/**
 * 模版打印
 * */
export function printGeneratorHtml(tableEl, name) {
  // 创建iframe元素
  const iframe = document.createElement('iframe')
  iframe.setAttribute('id', 'iframe')
  iframe.setAttribute('width', '1200px;')
  iframe.setAttribute('height', '800px;')
  /* iframe.setAttribute('style', 'display:none')*/
  document.body.appendChild(iframe)
  const doc = iframe.contentWindow!.document
  const oldDocumentName = document.title
  if (name) {
    document.title = name
  }
  doc.write(tableEl)
  doc.close()
  iframe.contentWindow!.focus()
  iframe.onload = async function () {
    iframe.contentWindow!.print()
    // 打印完毕后移除
    iframe.parentNode!.removeChild(iframe)
    await nextTick(() => {
      if (name) {
        document.title = oldDocumentName
      }
    })
  }

  // 调用打印
}
export async function exportExcel(htmlContent, fileName) {
  fileName = fileName + '.xls'
  const formData = new FormData()
  formData.append('htmlContent', htmlContent)
  formData.append('fileName', fileName)
  const res = await request({
    data: formData,
    method: 'post',
    responseType: 'blob',
    url: '/export/htmlToExcel.json',
  })
  const link = document.createElement('a')
  const blob = new Blob([res.data])
  link.style.display = 'none'
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
