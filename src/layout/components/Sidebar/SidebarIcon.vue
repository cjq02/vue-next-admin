<template>
  <svg-icon :icon-class="icon"></svg-icon>
</template>
<script setup>
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
})

const icons = import.meta.glob('/src/icons/nav-bar/*.svg')

const icon = computed(() => {
  if (_.includes(iconNames.value, props.name)) {
    return props.name
  }
  if (_.includes(iconNames.value, props.name.replace('-Filled', ''))) {
    return props.name.replace('-Filled', '')
  }
  return 'Nought'
})

const iconNames = computed(() => _.map(icons, (icon, key) => key.split('/').reverse()[0].replace('.svg', '')))
</script>
<style scoped lang="scss">
.svg-icon {
  margin-right: 5px;
  margin-top: -2px;
  width: 19px !important;
  height: 19px !important;
  vertical-align: middle;
  text-align: left !important;
  font-size: 0;
}
</style>
