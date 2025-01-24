import TreeUtils from '@/utils/tree.utils'

/**
 * 获取菜单树
 */
export const getMenuTree = () => apiUtils.get('/sys/menu/getMenuTree.json')
/**
 * 获取菜单下拉
 */
export const getRootMenuTreeSelectList = () => apiUtils.getSelectList('/sys/menu/getRootMenuList.json')

export const getMenuById = (id) =>
  apiUtils.get('/sys/menu/getMenuById.json', {
    id,
  })
/**
 * 获取菜单栏
 *
 * @param params
 */
export const findSideMenuList = (params?) => apiUtils.get('/sys/menu/findSideMenuList.json', params)
/**
 * 保存菜单
 *
 * @param data
 */
export const save = (data) => apiUtils.save('/sys/menu/saveMenu.json', data)

export const deletePermission = (id) => apiUtils.postParams('/sys/menu/deletePermission.json', { id })

export const getMenuTreeWithPermission = async () => {
  const data = await apiUtils.get('/sys/menu/findMenuListWithPermission.json')
  const tree = TreeUtils.listToSelectTree(data)
  console.log('permissionTree', tree)
  return tree
}

export const menuTreeListByRoleId = (roleId) =>
  apiUtils.get('/menu/menuTreeListByRoleId', {
    roleId,
  })
