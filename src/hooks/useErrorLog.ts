// https://blog.csdn.net/weixin_34865745/article/details/113992767
import bus from '@/utils/bus'
import request from '@/utils/request'

import pack from '../../package.json'

const errorLogReq = (errLog) => {
  request({
    bfLoading: false,
    data: {
      browserType: navigator.userAgent,
      errorLog: errLog,
      pageUrl: window.location.href,
      version: pack.version,
    },
    isAlertErrorMsg: true,
    method: 'post',
    url: '/ty-user/errorCollection/insert',
  }).then(() => {
    bus.emit('reloadErrorPage', {})
  })
}

export default function () {
  /*
   * type judge
   * base type  using 'type of'
   * Reference type using 'instance of'
   * recommend to reading https://www.jianshu.com/p/ddc7f189d130
   * */
  const checkNeed = () => {
    const appStore = useAppStore()
    const env = import.meta.env.VITE_APP_ENV
    const { errorLog } = appStore.settings
    if (typeof errorLog === 'string') {
      return env === errorLog
    }
    if (errorLog instanceof Array) {
      return errorLog.includes(env)
    }
    return false
  }
  if (checkNeed()) {
    window.addEventListener(
      'error',
      ({ error, target }) => {
        if (target.outerHTML) {
          // img error collection
          const errLog = `${JSON.stringify(target.outerHTML)}`
          errorLogReq(errLog)
        } else {
          const errLog = `${error.stack.substr(0, 300)}`
          errorLogReq(errLog)
        }
      },
      // use Event capture  to collection  img error
      true,
    )
  }
}
