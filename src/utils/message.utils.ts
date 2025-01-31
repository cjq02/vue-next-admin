import { message } from './libs/resetMessage'

const messageUtils = {
  /**
   * 通用确认方法
   * */
  async confirm(
    message,
    { title = '提示', confirmButtonText = '确定', cancelButtonText = '取消', type = 'warning', ...options } = {},
  ) {
    // @ts-ignore
    return MessageBox.confirm(message, title, {
      cancelButtonText,
      confirmButtonText,
      type,
      ...options,
    })
  },

  /**
   * 显示一次消息
   * */
  message,
  /**
   * 显示一次消息
   * */
  onceMessage: message,

  showResponseErrorMessage(message, options = {}) {
    return this.showResponseMessage({ message, success: false }, options)
  },

  /**
   * 显示服务端返回消息
   * */
  showResponseMessage(res, options = {}) {
    return new Promise((resolve, reject) => {
      message({
        duration: res.success ? 3000 : 6000,
        message: res.message || '系统服务异常，请联系管理员！',
        showClose: true,
        type: res.success ? 'success' : 'error',
        ...options,
      })
      if (res.success) {
        return resolve(res)
      }
      reject(res)
    }) as Promise<Http.IResponseResult>
  },
}

export default messageUtils
