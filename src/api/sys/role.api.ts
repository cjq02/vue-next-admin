/**
 * 根据ID获取角色
 * */
export const getRoleById = (roleId) =>
  apiUtils.get('/sys/role/getRoleById.json', {
    roleId,
  })
/**
 * 保存角色
 *
 * @param data
 */
export const saveRole = (data) => {
  return apiUtils.save('/sys/role/save.json', data)
}
/**
 * 删除角色
 *
 * @param roleId
 */
export const remove = (roleId) =>
  apiUtils.post('/sys/role/delete.json', {
    roleId,
  })
/**
 * 根据角色ID获取权限IDS
 *
 * @param roleId
 */
export const findPermissionIdsByRoleId = (roleId) => {
  return apiUtils.get('/sys/role/findPermissionIdsByRoleId.json', {
    roleId,
  })
}

/**
 * 角色下拉
 * */
export const findRoleSelectList = (corpId, inputValue?) =>
  apiUtils.getSelectList('/sys/role/findRoleSelectList.json', {
    params: { inputValue },
  })
