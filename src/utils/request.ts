import axios from 'axios'

import { getToken } from '@/utils/auth'
import { ResponseMock } from '@/utils/libs/responseMock'

// create an axios instance
const instance = axios.create({
  baseURL: '/' + import.meta.env.VITE_APP_BASE_API,
  // request timeout
  timeout: 25000,
  // send cookies when cross-domain requests
  withCredentials: true,
})

// request interceptor
instance.interceptors.request.use(
  (config) => {
    // do something before request is sent
    Object.assign(config.headers, getJwtHeaders())
    return config
  },
  (error) => {
    // do something with request error
    console.error(error)
    return Promise.reject(error)
  },
)

// response interceptor
instance.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    if (response.headers.authorization) {
      // 如果后台通过header返回token，说明token已经更新，则更新客户端本地token
      const userStore = useUserStore()
      userStore.updateToken(response.headers.authorization)
    }
    if (response.request.responseType === 'blob') {
      return response
    }
    return ResponseMock.instance.execute(response)
  },
  async (error) => {
    console.error(error)
    if (error.response) {
      if (error.response.status === 401) {
        const userStore = useUserStore()
        userStore.resetToken()
        // todo 暂时这么改
        setTimeout(() => {
          location.href = Constants.SYSTEM_URL.BASE
        }, 1000)
      }
      await $utils.messageUtils.showResponseErrorMessage(error.response.data.message)
    } else {
      if (error.code === 'ECONNABORTED') {
        $utils.messageUtils.message.error('请求连接超时，请联系管理员！')
      }
    }
    return Promise.reject(error.response.data)
  },
)

export default instance
/**
 * 额外的jwt headers参数
 */
export const getJwtHeaders = () => {
  const headers = {
    'Global-Device': 'web',
    'Global-Device-UUID': $utils.auth.getFpId(),
    'Global-Version': '1',
  }
  const token = getToken()
  if (token) {
    Object.assign(headers, { Authorization: token })
  }
  return headers
}
