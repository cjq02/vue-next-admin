/**
 * 获取用户信息
 * */
export const getUserInfo = () => apiUtils.get('/sys/user/getUserInfo.json')

/**
 * 根据ID获取用户
 * */
export const getUserById = (userId) => apiUtils.get('/sys/user/getUserById.json', { userId })

/**
 * 保存用户
 * */
export const saveUser = (data) => apiUtils.save('/sys/user/saveUser.json', data)

/**
 * 获取默认密码
 * */
export const getDefaultPassword = () => apiUtils.get('/sys/user/getDefaultPassword.json')

/**
 * 重置密码
 * */
export const resetPassword = (userId) =>
  apiUtils.get('/sys/user/resetPassword.json', {
    userId,
  })

/**
 * 修改密码
 * */
export const updatePassword = (params) => apiUtils.get('/sys/user/updatePassword.json', params)

/**
 * 修改默认密码
 * */
export const updateDefaultPassword = (params) => apiUtils.get('/sys/user/updateDefaultPassword.json', params)
