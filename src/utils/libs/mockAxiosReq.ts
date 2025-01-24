import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

import { getToken } from '@/utils/auth'

/**
 * create an axios instance
 * */
const service = axios.create({
  // url = base url + request url
  baseURL: '',
  // send cookies when cross-domain requests
  // withCredentials: true,
  // request timeout
  timeout: 5000,
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    const userStore = useUserStore()
    if (userStore.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  (error) => {
    // do something with request error
    // for debug
    console.log(error)
    return Promise.reject(error)
  },
)

// response interceptor
service.interceptors.response.use(
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
    const store = useStore()
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      ElMessage({
        ElMessage: res.ElMessage || 'Error',
        type: 'error',
        duration: 5 * 1000,
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        ElMessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again',
          'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning',
          },
        ).then(() => {
          store.user.resetToken()
          location.reload()
        })
      }
      return Promise.reject(new Error(res.ElMessage || 'Error'))
    }
    return res
  },
  (error) => {
    // for debug
    console.log('err' + error)
    ElMessage({
      ElMessage: error.ElMessage,
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  },
)

export default service
