/**
 * 登录
 * */
export const login = (data) => apiUtils.post('login.json', data)
/**
 * 登录失败次数
 */
export const getLoginFailCount = () => apiUtils.get('/getLoginFailCount.json')
/**
 * 获取密钥
 */
export const getEncryptKey = () => apiUtils.get('/getEncryptKey.json')
/**
 * 登出
 */
export const logout = () => apiUtils.get('/logout.json')
