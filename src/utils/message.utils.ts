import { message } from './libs/resetMessage'

const messageUtils = {
  /**
   * 显示一次消息
   * */
  onceMessage: message,
  /**
   * 显示一次消息
   * */
  message,
  /**
   * 显示服务端返回消息
   * */
  showResponseMessage(res, options = {}) {
    return new Promise((resolve, reject) => {
      message({
        message: res.message || '系统服务异常，请联系管理员！',
        type: res.success ? 'success' : 'error',
        duration: res.success ? 3000 : 6000,
        showClose: true,
        ...options,
      })
      if (res.success) {
        return resolve(res)
      }
      reject(res)
    }) as Promise<Http.IResponseResult>
  },
  showResponseErrorMessage(message, options = {}) {
    return this.showResponseMessage({ success: false, message }, options)
  },
  /**
   * 通用确认方法
   * */
  async confirm(
    message,
    { title = '提示', confirmButtonText = '确定', cancelButtonText = '取消', type = 'warning', ...options } = {},
  ) {
    // @ts-ignore
    return MessageBox.confirm(message, title, {
      confirmButtonText,
      cancelButtonText,
      type,
      ...options,
    })
  },
}

export default messageUtils
