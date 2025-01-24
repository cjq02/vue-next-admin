const _required = { required: true, message: '请填写', trigger: ['blur', 'change'] }

// 必填
export const required = [_required]

// 手机号码
export const phone = [_required, { pattern: /^1\d{10}$/, message: '手机号码错误', trigger: 'blur' }]
// 邮箱
export const email = [
  _required,
  { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '邮箱格式有误', trigger: 'blur' },
]
// 金额最多保留2位小数（单位元）
const checkCash1 = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入金额'))
  }
  value = Number(value)
  const reqExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  if (!reqExp.test(value)) {
    callback('请输入正确的金额')
  } else {
    // 通过验证
    callback()
  }
}
export const cash = [{ validator: checkCash1, trigger: 'blur' }]
// 金额最多保留6位小数（万元）
const checkCash2 = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入金额'))
  }
  value = Number(value)
  const reqExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,6})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  if (!reqExp.test(value)) {
    callback('请输入正确的金额')
  } else {
    // 通过验证
    callback()
  }
}
export const cash2 = [{ validator: checkCash2, trigger: 'blur' }]
