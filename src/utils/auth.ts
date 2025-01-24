import FingerprintJS from '@fingerprintjs/fingerprintjs'
import Cookies from 'js-cookie'

const TOKEN_KEY = 'token'
const FP_KEY = 'fp_key'

export function getToken() {
  return Cookies.get(TOKEN_KEY)
}

export function setToken(token) {
  return Cookies.set(TOKEN_KEY, token)
}

export function removeToken() {
  return Cookies.remove(TOKEN_KEY)
}

export function isAuth() {
  return $utils.isEmpty(getToken())
}

export function setFpId(fpId) {
  return Cookies.set(FP_KEY, fpId)
}

export async function loadFingerPrint() {
  if (Cookies.get(FP_KEY)) {
    return
  }
  // eslint-disable-next-line import/no-named-as-default-member
  const fp = await FingerprintJS.load()
  const res = await fp.get()
  setFpId(res.visitorId)
}

export function getFpId() {
  return Cookies.get(FP_KEY)
}
