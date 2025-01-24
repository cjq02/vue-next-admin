export const useValidator = function (formRef = null, model: any = {}) {
  const methods = {
    newPassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (model.newPassword !== '') {
          formRef.value.validateField('newPassword')
        }
        callback()
      }
    },
    confirmNewPassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== model.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },

    tableDataNotEmpty(rule, value, callback) {
      const dataExcludeDelete = _.filter(value, (rowData) => rowData.rowState !== Constants.rowState.DELETED)
      if (dataExcludeDelete.length === 0) {
        callback(new Error('请至少填写一行'))
      }
      callback()
    },
  }

  const baseFormRules = {
    input: { required: true, message: '请填写', trigger: ['blur', 'change'] },
    select: { required: true, message: '请选择', trigger: ['blur', 'change'] },
  }

  return {
    ...methods,
    baseFormRules,
  }
}
