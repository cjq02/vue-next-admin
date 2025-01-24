/** 重置message，防止重复点击重复弹出message弹框 */
import { ElMessage as Message, Message as IMessage } from 'element-plus'

let messageInstance = null
const mainMessage = function doneMessage(options) {
  // 如果弹窗已存在先关闭
  if (messageInstance) {
    messageInstance.close()
  }
  messageInstance = Message(options)
  return messageInstance
}
const arr = ['success', 'warning', 'info', 'error']
arr.forEach(function (type) {
  mainMessage[type] = function (options) {
    if (typeof options === 'string') {
      options = {
        message: options,
      }
    }
    options.type = type
    return mainMessage(options)
  }
})
// @ts-ignore
export const message: IMessage = mainMessage
