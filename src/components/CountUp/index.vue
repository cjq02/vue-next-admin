<template>
  <span ref="count" />
</template>

<script>
import { CountUp } from 'countup.js'

const defaultOptions = {
  // number to start at (0)
  startVal: 0,
  // number of decimal places (0)
  decimalPlaces: 0,
  // animation duration in seconds (2)
  duration: 2,
  // example: 1,000 vs 1000 (true)
  useGrouping: true,
  // ease animation (true)
  useEasing: true,
  // smooth easing for large numbers above this if useEasing (999)
  smartEasingThreshold: 999,
  // amount to be eased for numbers above threshold (333)
  smartEasingAmount: 333,
  // grouping separator (',')
  separator: ',',
  // decimal ('.')
  decimal: '.',

  // easingFn: easing function for animation (easeOutExpo)
  // easingFn: (t: number, b: number, c: number, d: number) => number,
  // formattingFn: (n: number) => string, // this function formats result
  // prefix: string, // text prepended to result
  // suffix: string, // text appended to result
  // numerals: string[], // numeral glyph substitution
}
export default {
  name: 'CountUp',
  props: {
    // 起始值
    endVal: {
      type: Number,
      default: 0,
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    endVal() {
      if (this.$refs.count) {
        this.initCountUp()
      }
    },
  },
  mounted() {
    this.initCountUp()
  },
  methods: {
    initCountUp() {
      const coutOptions = Object.assign({}, defaultOptions, this.options)
      const countUp = new CountUp(this.$refs.count, this.endVal, coutOptions)
      countUp.start()
    },
  },
}
</script>
