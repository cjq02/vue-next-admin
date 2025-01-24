/**
 * 获取列表
 *
 * @param data
 */
export const findList = (data) => apiUtils.findSelectList('/sys/corp/findCorpList.json', { data })

/**
 * 获取企业下拉树
 */
export const getSelectTree = () =>
  apiUtils.getTreeSelectList('/sys/corp/findCorpList.json', {
    data: {},
    method: 'post',
    parentId: 'parentCorpId',
  })

/**
 * 根据ID获取企业信息
 * */
export const getCorpById = (id) =>
  apiUtils.get('/sys/corp/getCorpById.json', {
    id,
  })
/**
 * 保存
 *
 * @param data
 */
export const save = (data) => apiUtils.post('/sys/corp/saveCorp.json', data)
