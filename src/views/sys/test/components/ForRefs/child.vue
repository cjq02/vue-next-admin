<script setup>
const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
})

function childFunc() {
  return `I'm child ${props.value}`
}

defineExpose({ childFunc })
</script>

<template>
  <div>Child{{ value }}</div>
</template>
