import TreeUtils from '@/utils/tree.utils'

/**
 * 获取分类列表
 * */
export const findCateList = (data) => apiUtils.post('/file/fileManageCate/findFileManageCateList.json', data)
/**
 * 获取分类下拉树
 * */
export const getCateSelectTree = async () => {
  const list = await findCateList({ condition: {} })
  return TreeUtils.listToSelectTree(list, { parentId: 'parentId' })
}
/**
 * 保存文件管理
 *
 * @param data
 */
export const saveFileManage = (data) => apiUtils.save('/file/fileManage/saveFileManage.json', data)
/**
 * 根据ID获取数据
 *
 * @param id
 */
export const getFileManageById = (id) =>
  apiUtils.get('/file/fileManage/getFileManageById.json', {
    id,
  })
