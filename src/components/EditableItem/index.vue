<!--suppress JSCheckFunctionSignatures -->
<template>
  <el-form-item
    v-bind="$attrs"
    :label="displayLabel"
    :prop="prop"
    :rules="customRules"
    :label-width="labelWidth"
    :class="{ 'edit-disabled': !editable }"
    class="edit-item"
  >
    <slot
      v-if="editable"
      :prop="prop"
      :prop-name="propName"
      :prop-key="propKey"
      :code="code"
      :code-list="codeList"
      :unit="unit"
    ></slot>
    <slot v-else-if="slots.content" name="content" :prop="prop" :prop-key="propKey" :unit="unit"></slot>
    <tooltip-over v-else :content="content" :unit="unit" />
  </el-form-item>
</template>
<script lang="ts">
export default {
  name: 'EditableItem',
}
</script>
<script setup lang="ts">
const slots = useSlots()
const codeStore = useCodeStore()

const props = defineProps({
  code: {
    default: '',
    type: String,
  },
  dateFormat: {
    default: '',
    type: String,
  },
  editable: {
    default: true,
    type: Boolean,
  },
  label: {
    default: '',
    type: String,
  },
  labelWidth: {
    default: '',
    type: String,
  },
  model: {
    default: () => ({}),
    type: Object,
  },
  prop: {
    default: '',
    type: String,
  },
  propName: {
    default: '',
    type: String,
  },
  rules: {
    default: () => [],
    type: [Object, Array],
  },
  unit: {
    default: '',
    type: String,
  },
})

const content = computed(() => {
  if (commonUtils.isNotEmpty(props.propName)) {
    return props.model[props.propName]
  }
  if (commonUtils.isNotEmpty(props.code)) {
    return codeStore.maps[props.code][props.model[propKey.value]]
  }
  if (commonUtils.isNotEmpty(props.dateFormat)) {
    return $filters.dateFormat(props.model[propKey.value], props.dateFormat)
  }
  return props.model[propKey.value]
})

const propKey = computed(() => {
  if (props.prop.includes('.')) {
    const propList = props.prop.split('.')
    return propList[propList.length - 1]
  }
  return props.prop
})

const codeList = computed(() => codeStore.lists[props.code])

const displayLabel = computed(() => (commonUtils.isEmpty(props.label) ? '' : props.label + ':'))

const customRules = computed<any>(() => (props.editable ? props.rules : []))
</script>
<style lang="scss" scoped>
.edit-disabled {
  &.el-form-item {
    margin-bottom: 0 !important;
  }
}
</style>
