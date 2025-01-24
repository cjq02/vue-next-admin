/**
 * 根据ID获取公告
 * */
export const getAnnounceById = (id) =>
  apiUtils.get('announce/getById.json', {
    id,
  })

/**
 * 保存公告
 * */
export const saveAnnounce = (data) => {
  return apiUtils.save('announce/save.json', data)
}

/**
 * 公告列表
 * */
export const getPublicAnnounceList = () => {
  return apiUtils.get('/announce/getPublicList.json')
}
