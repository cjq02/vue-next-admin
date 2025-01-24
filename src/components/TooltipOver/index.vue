<template>
  <div class="text-tooltip">
    <el-tooltip
      class="item"
      effect="dark"
      :disabled="isShowTooltip"
      :content="content"
      placement="top"
      popper-class="text-tooltip-con"
    >
      <p class="ellipsis" @mouseover="onMouseOver">
        <span ref="tooltipRef">
          {{ content || '--' }}
          <em v-if="content">{{ unit }}</em>
        </span>
      </p>
    </el-tooltip>
  </div>
</template>
<script lang="ts">
export default {
  name: 'TooltipOver',
}
</script>
<script setup lang="ts">
defineProps({
  content: {
    type: [String, Number],
    default: '',
  },
  unit: {
    type: String,
    default: '',
  },
})

const isShowTooltip = ref(true)
const tooltipRef = ref(null)

function onMouseOver() {
  const parentWidth = tooltipRef.value.parentNode.offsetWidth
  const contentWidth = tooltipRef.value.offsetWidth
  isShowTooltip.value = contentWidth <= parentWidth
}
</script>

<style lang="scss">
.text-tooltip-con {
  max-width: 80% !important;
}
</style>
