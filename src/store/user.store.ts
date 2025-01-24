import { defineStore } from 'pinia'

import { getToken, removeToken, setToken } from '@/utils/auth'

const useUserStore = defineStore('user', () => {
  const userInfo = ref<any>({})

  const token = computed(() => getToken())
  const roles = computed(() => userInfo.value.roleTypes)
  const permissions = computed(() => userInfo.value.permissions)

  /*
   * 获取用户信息
   * */
  async function loadUserInfo() {
    const res = await userApi.getUserInfo()
    userInfo.value = res.info
  }
  /**
   * 登录
   * */
  async function login(data) {
    const res = await $api.loginApi.login(data)
    if (!res.success) {
      return messageUtils.showResponseMessage(res)
    }
    return res
  }

  /*
   * 退出登录
   * */
  async function logout() {
    const res = await $api.loginApi.logout()
    if (!res.success) {
      return
    }
    commonUtils.clearObject(userInfo.value)
    removeToken()
  }
  /**
   * 移除token
   * */
  function resetToken() {
    removeToken()
  }

  /**
   * 更新token
   * */
  function updateToken(value) {
    setToken(value)
  }

  return { loadUserInfo, login, logout, permissions, resetToken, roles, token, updateToken, userInfo }
})

export default useUserStore
