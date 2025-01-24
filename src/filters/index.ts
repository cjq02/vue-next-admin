export default {
  dateFormat(value, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!value) {
      return
    }
    if (!(value instanceof Date)) {
      value = new Date(value)
    }
    return dayjs(value).format(format)
  },

  codeFormat(value, typeCode) {
    const store = useStore()
    const codeMap = store.code.maps[typeCode]
    if (_.includes(value, ',')) {
      const names = _.map(value.split(','), (code) => codeMap[_.trim(code)])
      return names.join('，')
    }
    return codeMap[value]
  },

  numberToCurrency(value) {
    if (!value) return 0
    // 获取整数部分
    const intPart = Math.trunc(value)
    // 整数部分处理，增加,
    const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    // 预定义小数部分
    let floatPart = ''
    // 将数值截取为小数部分和整数部分
    const valueArray = value.toString().split('.')
    if (valueArray.length === 2) {
      // 有小数部分
      // 取得小数部分
      floatPart = valueArray[1].toString()
      return intPartFormat + '.' + floatPart
    }
    return intPartFormat + floatPart
  },

  thousandSeparator(value, { showEmpty = false, emptyAlias = '', isInt = false, precision = 2 } = {}) {
    if ($utils.isEmpty(value) || isNaN(Number(value))) {
      if (isInt) {
        return '0'
      }
      if (showEmpty) {
        return ''
      }
      if (emptyAlias) {
        return emptyAlias
      }
      return '0.00'
    }
    value = '' + _.round(value, precision)
    // 获取整数部分
    const intPart = parseInt(value)
    const intPartFormat =
      // 将整数部分逢三一断
      !intPart && value < 0 ? '-' + intPart : intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    const value2Array = value.split('.')

    if (isInt) {
      return intPartFormat
    }
    // =2表示数据有小数位
    if (value2Array.length !== 2) {
      return intPartFormat
    }
    // 拿到小数部分
    const floatPart = value2Array[1]
    return intPartFormat + '.' + floatPart
  },

  thousandSeparatorToNumber(value) {
    return Number(value.replace(/,/g, ''))
  },
}
