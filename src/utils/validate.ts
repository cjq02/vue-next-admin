/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 校验用户名,必须是5-32位
 * @param {string} str
 * @returns {Boolean}
 */
export function isValidUsername(str) {
  const reg = /^[0-9A-Za-z]{3,32}$/
  return reg.test(str)
}

const regExp = {
  mobile: /(^1[3|4|5|7|8|9][0-9]\d{8})$/i,
}

export { regExp }
