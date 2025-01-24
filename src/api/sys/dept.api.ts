/**
 * 部门下拉
 * */
export const findDeptSelectList = (corpId, inputValue) =>
  apiUtils.getSelectList('/sys/dept/findSelectList.json', {
    params: {
      corpId,
      inputValue,
    },
  })
/**
 * 保存部门
 * */
export const saveDept = (data) => apiUtils.save('/sys/dept/saveDepartment.json', data)
/**
 * 保存部门列表
 * */
export const saveDeptList = (data) => apiUtils.save('/sys/dept/saveDepartmentList.json', data)
/**
 * 删除
 * */
export const remove = (deptId) => {
  return apiUtils.post('/sys/dept/deleteDepartmentById.json', {
    deptId,
  })
}
