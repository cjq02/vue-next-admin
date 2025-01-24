import { AxiosRequestConfig } from 'axios'

import request from '@/utils/request'

interface DownloadOptions {
  url: string
  method: string
  data: any
  params: any
  name: string
  showLoading: boolean
  onProgress: (evt) => void
  onSuccess: (response: any) => void
  onError: (evt) => void
  requestOptions: AxiosRequestConfig
}

export const doDownload = async (options: DownloadOptions) => {
  const {
    url = '',
    method = 'get',
    data = undefined,
    params = undefined,
    name = undefined,
    showLoading = true,
    onProgress = undefined,
    onSuccess = undefined,
    onError = undefined,
    requestOptions = {},
  } = options
  // noinspection JSUnusedGlobalSymbols
  Object.assign(requestOptions, {
    url,
    responseType: 'blob',
    timeout: 3600000,
    method,
    data,
    params,
    onDownloadProgress: (evt) => {
      // @ts-ignore
      const percent = parseInt((evt.loaded / evt.total) * 100)
      if (typeof onProgress === 'function') {
        evt.percent = percent
        onProgress(evt)
        console.log('evt', evt)
      }
      if (showLoading) {
        if (!_.isNaN(percent)) {
          document.querySelector('.download-percent').innerHTML = percent + '%'
        }
        document.querySelector('.download-transfer-rate').innerHTML = $utils.getTransferRate(evt.loaded, evt.total)
      }
    },
    ...requestOptions,
  })
  await $utils.onLoading(
    async () => {
      if (showLoading) {
        document.querySelector('.el-loading-text').innerHTML = `
        <span>
          正在下载，请稍候：
          <label class="download-percent">0%</label>
          <label class="download-transfer-rate mt10" style="min-width:150px;display:inline-block;color:rgba(144,146,148,0.77)"></label>
        <span>
      `
      }
      const res = await request(requestOptions)
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(new Blob([res.data]))
      const contentDisposition = res.headers['content-disposition']
      if (_.isUndefined(contentDisposition)) {
        const responseResultText = await res.data.text()
        if (_.isEmpty(responseResultText)) {
          if (typeof onError === 'function') {
            onError({})
          }
          return $utils.messageUtils.message.error('下载失败，请联系管理员！')
        }
        try {
          const responseResult = JSON.parse(responseResultText)
          return $utils.messageUtils.showResponseMessage(responseResult)
        } catch (e) {
          if (typeof onError === 'function') {
            onError(e)
          }
          console.error(e)
        }
      }
      let fileName = name
      if (!name) {
        if (res.headers['content-disposition']) {
          fileName = decodeURIComponent(res.headers['content-disposition'].split('filename=')[1])
        } else {
          fileName = url.substring(url.lastIndexOf('/') + 1)
        }
      }
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      if (typeof onSuccess === 'function') {
        onSuccess(res)
      }
    },
    { target: '.d2-container-full', disabled: !showLoading },
  )
}
