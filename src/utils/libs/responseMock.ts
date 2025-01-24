export class ResponseMock {
  public static instance = new ResponseMock()
  public static requestConfig: any = {}

  public execute(response) {
    ResponseMock.requestConfig = response.config
    const url = ResponseMock.requestConfig.url
    const interceptor = requestUrlMap[url]
    if (interceptor) {
      console.log('request interceptor url: ', url)
      return interceptor.handler(response.data, response)
    }

    return response.data
  }
}

// noinspection JSUnusedGlobalSymbols
const requestUrlMap = {}
