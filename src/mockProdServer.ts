// noinspection JSUnusedGlobalSymbols

import { createProdMockServer } from 'vite-plugin-mock/createProdMockServer'
// import.meta.glob 进行全部导入
const modulesFiles = import.meta.glob('../mock/**/*.mock.ts', { eager: true })
let modules = []
for (const path in modulesFiles) {
  modules = modules.concat(modulesFiles[path].default)
}

function extendXMLHttpRequestUpload() {
  const xhr = new window._XMLHttpRequest()
  window.XMLHttpRequest.prototype.upload = xhr.upload
}

export function setupProdMockServer() {
  createProdMockServer([...modules])
  extendXMLHttpRequestUpload()
}
