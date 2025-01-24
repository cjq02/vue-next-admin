/**
 * 根据bizId获取文件列表
 * */
export const findListByBizId = (bizId) => {
  return apiUtils.get('/file/findListByBizId.json', {
    bizId,
  })
}
