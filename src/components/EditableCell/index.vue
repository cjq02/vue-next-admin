<template>
  <div class="edit-cell" @click="onCellClick">
    <template v-if="!editable">
      <slot name="content" />
    </template>
    <template v-else>
      <div v-if="!editMode && !showInput" tabindex="0" :class="{ 'empty-cell-height': isEmptyValue }">
        <slot name="content" />
      </div>
      <el-form-item v-else :prop="prop" :rules="rules">
        <component
          :is="editableComponent"
          v-if="$slots['edit-component-slot'] && (editMode || showInput)"
          ref="input"
          v-model="value"
          v-bind="$attrs"
          @focus="onCellClick"
          @click="onClick"
        >
          <slot name="edit-component-slot" />
        </component>
        <component
          :is="editableComponent"
          v-else-if="!$slots['edit-component-slot'] && (editMode || showInput)"
          ref="input"
          v-model="value"
          v-bind="$attrs"
          @focus="onCellClick"
          @click="onClick"
        ></component>
      </el-form-item>
    </template>
  </div>
</template>
<script>
import { computed, ref } from 'vue'

export default {
  name: 'EditableCell',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Array, Number, Date, Object],
      default: '',
    },
    toolTipContent: {
      type: String,
      default: '点击编辑',
    },
    toolTipDelay: {
      type: Number,
      default: 500,
    },
    toolTipPlacement: {
      type: String,
      default: 'top-start',
    },
    showInput: {
      type: Boolean,
      default: false,
    },
    editableComponent: {
      type: String,
      default: 'el-input',
    },
    closeEvent: {
      type: String,
      default: 'blur',
    },
    prop: {
      type: String,
      default: '',
    },
    rules: {
      type: [Object, Array],
      default: () => [],
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'click', 'cell-click'],
  setup: function (props, { emit }) {
    const editMode = ref(false)
    const value = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    })
    const isEmptyValue = computed(() => $utils.isEmpty(value.value))

    return {
      value,
      isEmptyValue,
      editMode,
      onCellClick() {
        if (props.editable) {
          emit('cell-click')
        }
      },
      onClick() {
        if (props.editable) {
          emit('click')
        }
      },
    }
  },
}
</script>
<style scoped lang="scss">
.empty-cell-height {
  height: 20px;
}
</style>
