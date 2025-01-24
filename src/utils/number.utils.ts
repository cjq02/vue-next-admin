// noinspection JSUnresolvedFunction

export default {
  /**
   * 合计
   * */
  sum(arr, precision = 0) {
    return _.chain(arr)
      .map((num) => {
        if (_.isNaN(num)) {
          return 0
        }
        return Number(num) || 0
      })
      .sum()
      .round(precision)
      .value()
  },
  /**
   * 相减
   * */
  sub(num1, num2, precision = 0) {
    return _.round(num1 - num2, precision)
  },
  /**
   * 相乘
   * */
  multiply(num1, num2, precision = 0) {
    return _.round(num1 * num2, precision)
  },
  /**
   * 相除
   * */
  div(num1, num2, precision = 0, { trailingZero = false, isPercent = false } = {}) {
    const num = _.round(num1 / num2, precision)
    if (_.isNaN(num)) {
      return 0
    }
    if (trailingZero) {
      return this.addZeroes(num, precision)
    }
    if (isPercent) {
      return _.round(num * 100, Math.abs(precision - 2)) + '%'
    }
    return num
  },

  addZeroes(num, precision) {
    return num.toFixed(Math.max(((num + '').split('.')[1] || '').length, precision))
  },

  /**
   * @param num 数字
   * @param oneBased 是否从1开始
   * @example 5 ==> [0, 1, 2, 3, 4]
   *
   * */
  numberToArray: (num, oneBased = false) => [...Array(num).keys()].map((x) => x + (oneBased && 1)),
}
