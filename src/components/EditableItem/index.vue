<!--suppress JSCheckFunctionSignatures -->
<template>
  <el-form-item v-bind="$attrs" :label="displayLabel" :prop="prop" :rules="customRules" :label-width="labelWidth">
    <slot v-if="editable" :prop="prop" :prop-name="propName" :code-list="codeList" :unit="unit"></slot>
    <slot v-else-if="slots.content" name="content" :prop="prop" :unit="unit"></slot>
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
const store = useStore()

const props = defineProps({
  editable: {
    type: Boolean,
    default: true,
  },
  model: {
    type: Object,
    default: () => ({}),
  },
  prop: {
    type: String,
    default: '',
  },
  propName: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  rules: {
    type: [Object, Array],
    default: () => [],
  },
  code: {
    type: String,
    default: '',
  },
  unit: {
    type: String,
    default: '',
  },
  labelWidth: {
    type: String,
    default: '',
  },
})

const content = computed(() => {
  if ($utils.isNotEmpty(props.propName)) {
    return props.model[props.propName]
  }
  if ($utils.isNotEmpty(props.code)) {
    return store.code.maps[props.code][props.model[props.prop]]
  }
  if (props.prop.includes('.')) {
    return getDescendantProp(props.model, props.prop)
  }
  return props.model[props.prop]?.toString()
})

const codeList = computed(() => store.code.lists[props.code])

const displayLabel = computed(() => ($utils.isEmpty(props.label) ? '' : props.label + ':'))

const customRules = computed(() => (props.editable ? props.rules : []))

function getDescendantProp(obj, desc) {
  const arr = desc.split('.')
  // noinspection StatementWithEmptyBodyJS
  while (arr.length && (obj = obj[arr.shift()]));
  return obj
}
</script>
