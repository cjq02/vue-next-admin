// noinspection SpellCheckingInspection
// noinspection JSUnusedGlobalSymbols

/**
 * @author Jonas Raoni
 * @link https://gist.github.com/jonasraoni/9dea65e270495158393f54e36ee6b78d
 * @description
 *  binding: {
 *    arg: {
 *      integer: 整型
 *      decimal: 浮点型
 *    },
 *    value: {
 *      precision: 精度
 *      scale: 浮点位数
 *      leadingZero：前导符为零
 *      range: 范围，如[1, 100]表示支持输入的值范围在1到100
 *    }
 *  }
 * */
export default class NumericDirective {
  /**
   * 绑定参数
   * */
  private binding

  /**
   * @param input
   * @param binding
   * */
  constructor(input, binding) {
    Object.assign(this, { binding, input, ...this.methods })
    input.addEventListener('keydown', this)
    input.addEventListener('keyup', this)
    input.addEventListener('change', this)
    input.addEventListener('compositionend', this)
  }

  static install(Vue) {
    Vue.directive('numeric', this.directive)
  }

  static directive = {
    beforeMount(el, binding) {
      const input = el instanceof HTMLInputElement ? el : el.querySelector('input')
      if (input) {
        return new NumericDirective(input, binding)
      }
      return new NumericDirective(el, binding)
    },
  }

  handleEvent(event) {
    this[event.type](event)
  }

  keyboardCodes = [
    'Delete',
    'Backspace',
    'Tab',
    'Esc',
    'Escape',
    'Enter',
    'Home',
    'End',
    'PageUp',
    'PageDown',
    'Del',
    'Delete',
    'Left',
    'ArrowLeft',
    'Right',
    'ArrowRight',
    'Insert',
    'Up',
    'ArrowUp',
    'Down',
    'ArrowDown',
  ]

  methods = {
    isDecimal(binding) {
      return binding.arg === 'decimal'
    },

    setValue(target, value) {
      if (target.value !== value) {
        target.value = value
        const event = document.createEvent('UIEvent')
        // @ts-ignore
        event.initEvent('input', true, false, window, 0)
        target.dispatchEvent(event)
      }
    },
  }

  keydown(event) {
    const { target, key, keyCode, ctrlKey } = event
    const value = target.value || ''
    const isDecimal = this.methods.isDecimal(this.binding)
    const signed = this.binding.modifiers.signed
    // ctrl+a, c, x, v
    const otherKeyboardPressed = this.keyboardCodes.includes(key) || (ctrlKey && [65, 67, 86, 88].includes(keyCode))
    let precision = isDecimal ? 18 : 9
    if (this.binding.value.precision) {
      precision = this.binding.value.precision
    }
    if (
      !(
        (key >= '0' && key <= '9') ||
        (((key === '.' && isDecimal) || (key === '-' && signed)) && !~value.indexOf(key)) ||
        otherKeyboardPressed
      )
    ) {
      event.preventDefault()
    }
    if (
      value.replace('.', '').replace('-', '').length >= precision &&
      !otherKeyboardPressed &&
      $utils.isEmpty(window.getSelection().toString())
    ) {
      event.preventDefault()
    }
  }

  keyup({ target }) {
    const isDecimal = this.methods.isDecimal(this.binding)
    let value = target.value
    let scale = 4
    if (isDecimal && this.binding.value.scale) {
      scale = this.binding.value.scale
    }
    if (value.indexOf('.') > -1 && value.split('.')[1].length > scale) {
      value = value.split('.')[0] + '.' + value.split('.')[1].substring(0, scale)
      this.methods.setValue(target, value)
    }
  }

  change({ target }) {
    const isDecimal = this.methods.isDecimal(this.binding)
    const range = this.binding.value.range
    let value = target.value
    if (!value) {
      return
    }
    const isNegative = /^\s*-/.test(value) && this.binding.modifiers.signed
    /* value = value.replace(isDecimal ? /[^\d,.]/g : /\D/g, '');*/
    if (isDecimal) {
      const pieces = value.split(/[,.]/)
      const decimal = pieces.pop().replace(/0+$/, '')
      if (pieces.length) {
        value = `${pieces.join('') || (decimal ? '0' : '')}${decimal ? `.${decimal}` : ''}`
      }
    } else {
      if (!this.binding.value.leadingZero) {
        value = Number(value).toFixed(0).toString()
      }
    }
    if (!this.binding.value.leadingZero) {
      value = value.replace(/^(?:0(?!\b))+/, '')
    }
    if (value && isNegative) {
      value = `-${value}`
    }
    if (range) {
      const min = range[0]
      const max = range[1]
      if (Number(value) < min) {
        this.methods.setValue(target, min)
      }
      if (Number(value) > max) {
        this.methods.setValue(target, max)
      }
    }
    this.methods.setValue(target, value)
  }

  compositionend() {
    document.execCommand('undo')
  }
}
