export const useValidator = function (formRef = null, model: any = {}) {
  const methods = {
    confirmNewPassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== model.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    newPassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (model.newPassword !== '') {
          // @ts-ignore
          formRef!.value.validateField('newPassword')
        }
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
    input: { message: '请填写', required: true, trigger: ['blur', 'change'] },
    select: { message: '请选择', required: true, trigger: ['blur', 'change'] },
    tableDataNotEmpty: {
      validator: (rule, value, callback) => {
        const dataExcludeDelete = _.filter(value, (rowData) => rowData.rowState !== Constants.rowState.DELETED)
        if (dataExcludeDelete.length === 0) {
          callback(new Error('请至少填写一行'))
        }
        callback()
      },
    },
    tableFieldUnique: {
      validator: (rule, value, callback) => {
        const keys = rule.field.split('.')
        const listKey = keys[0]
        const columnKey = keys[2]
        const count = _.countBy(commonUtils.excludes(model[listKey], { rowState: Constants.rowState.DELETED }), {
          [columnKey]: value,
        })
        if (count.true > 1) {
          return callback(new Error('不能重复'))
        }
        return callback()
      },
    },
  }

  return {
    ...methods,
    baseFormRules,
  }
}
