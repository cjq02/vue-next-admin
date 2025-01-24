import request from '@/utils/request'

const env = import.meta.env.VITE_APP_ENV

export function getCodeMap(typeCode) {
  return request({
    method: 'get',
    params: {
      typeCode,
    },
    url: '/sys/code/map.json',
  })
}

export async function findCodeList(typeCode) {
  const _url = '/sys/code/list.json'
  let codeList = await request({
    method: 'get',
    params: {
      typeCode,
    },
    url: _url,
  })
  // @ts-ignore
  codeList = _.map(codeList, (item) =>
    _.assign(
      {
        code: item.configCode,
        name: item.configName,
      },
      item,
    ),
  )
  return codeList
}

export function getCodeGroupMapFromCache() {
  return request({
    method: 'get',
    url: '/sys/code/getCodeGroupMapFromCache.json',
  })
}

export async function findSelectList(typeCode, hasAll) {
  const codeList = await this.findCodeList(typeCode)
  const list = _.map(codeList, (item) =>
    _.assign(
      {
        label: item.configName,
        value: item.configCode,
      },
      item,
    ),
  )

  if (hasAll) {
    list.unshift({
      label: '全部',
      value: '',
    })
  }
  return list
}

export function findEnumPackageList() {
  return request({
    method: 'get',
    url: '/sys/code/findEnumPackageList.json',
  })
}

export const generateCode = () => apiUtils.get('/sys/code/generateCode.json', { isDev: env === 'dev' })

export function getEnumPackageName(typeCode) {
  return request({
    method: 'get',
    params: {
      typeCode,
    },
    url: '/sys/code/getEnumPackageName.json',
  })
}

export function generateEnum(data) {
  return apiUtils.save('/sys/code/generateEnum.json', data)
}

export function saveCodeList(data) {
  return apiUtils.save('/sys/code/saveCodeList.json', data)
}

export function deleteById(id) {
  return apiUtils.remove(id, '/sys/code/deleteById.json')
}

/**
 * 删除
 * */
export function deleteByTypeCode(typeCode, url) {
  return request({
    method: 'post',
    params: {
      typeCode,
    },
    url: url,
  })
}

/**
 * 枚举列表
 * */
export function findEnumList(typeCode) {
  return request({
    method: 'get',
    params: {
      typeCode,
    },
    url: '/sys/code/findEnumList.json',
  })
}

export function reloadCodeCache() {
  return request({
    method: 'get',
    url: '/sys/code/reloadCodeCache.json',
  })
}
