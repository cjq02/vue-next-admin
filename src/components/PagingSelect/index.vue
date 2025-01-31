<template>
  <div class="el-select-box">
    <el-tooltip :content="label" :disabled="isTooltipDisabled || !showOverflowTooltip" placement="bottom">
      <el-select
        ref="selectRef"
        v-model="selectValue"
        v-bind="$attrs"
        :placeholder="placeholder"
        :allow-create="allowCreate"
        :style="'width:100%;max-height:' + maxHeight"
        :multiple="multiple"
        value-key="value"
        filterable
        :reserve-keyword="reserveKeyword"
        :clearable="clearable"
        remote-show-suffix
        remote
        :remote-method="filter"
        :popper-class="showPagination && !showEmptyTip ? popperClass + ' paging-select-popover' : ''"
        @visible-change="handleVisibleChange"
        @change="handleSelectChange"
      >
        <div v-if="showSelectAll" style="padding: 5px 20px 10px; text-align: right">
          <el-button style="" type="primary" size="small" @click="handleSelectAll">全选</el-button>
          <el-button style="" type="info" size="small" @click="handleSelectReset">重置</el-button>
        </div>
        <el-option v-for="item in visibleSelectOptions" :key="item.value" :label="item.label" :value="item">
          <slot v-if="slots.optionContent" name="optionContent" :item="item"></slot>
        </el-option>
        <template v-if="showEmptyTip">
          <el-option :value="emptyOptionData" disabled style="text-align: center">无数据</el-option>
        </template>
        <div v-if="showPagination && !showEmptyTip" class="pagination pl20">
          <el-pagination
            v-model:current-page="pageInfo.currentPage"
            v-model:page-size="pageInfo.pageSize"
            size="small"
            class="tc"
            background
            layout="total, prev, pager, next"
            :page-count="pageCount"
            :pager-count="pagerCount"
            :total="total"
            @size-change="changeSize"
            @current-change="handleCurrentChange"
            @prev-click="fetchPrev"
            @next-click="fetchNext"
          />
        </div>
      </el-select>
    </el-tooltip>
  </div>
</template>
<script lang="ts">
export default {
  name: 'PagingSelect',
}
</script>
<script setup lang="ts">
const slots = useSlots()

const props = defineProps({
  action: {
    default: null,
    type: Function,
  },
  actionUrl: {
    default: '',
    type: String,
  },
  allowCreate: {
    default: false,
    type: Boolean,
  },
  autoFetch: {
    default: false,
    type: Boolean,
  },
  beforeChange: {
    default: null,
    type: Function,
  },
  beforeOpen: {
    default: null,
    type: Function,
  },
  clearable: {
    default: true,
    type: Boolean,
  },
  condition: {
    default: () => ({}),
    type: Object,
  },
  controlsSelectHeight: {
    default: false,
    type: Boolean,
  },
  height: {
    default: 200,
    type: [Number, String],
  },
  label: {
    default: '',
    type: String,
  },
  modelValue: {
    default: '',
    type: [String, Object],
  },
  multiple: {
    default: false,
    type: Boolean,
  },
  onceRemote: {
    default: true,
    type: Boolean,
  },
  optionLabelField: {
    default: '',
    type: String,
  },
  optionValueField: {
    default: '',
    type: String,
  },
  pagerCount: {
    default: 5,
    type: Number,
  },
  placeholder: {
    default: '请选择',
    type: String,
  },
  popperClass: {
    default: '',
    type: String,
  },
  processData: {
    default: null,
    type: Function,
  },
  reserveKeyword: {
    default: true,
    type: Boolean,
  },
  showOverflowTooltip: {
    default: false,
    type: Boolean,
  },
  showPagination: {
    default: true,
    type: Boolean,
  },
  showSelectAll: {
    default: false,
    type: Boolean,
  },
  size: {
    default: 'small',
    type: String,
  },
  valueType: {
    default: Constants.PAGING_SELECT_VALUE_COMMA,
    type: String,
  },
})

const emit = defineEmits(['update:modelValue', 'update:label', 'change'])

const selectRef = ref()
const currentSelectOption = ref(null as any)
const loading = ref(false)
const pageCount = ref(1)
const total = ref(0)
const selectOptions = ref([] as any)
const selectFocusVisible = ref(false)
const needReload = ref(false)
const isTooltipDisabled = ref(true)
const emptyOptionData = ref('')
const selectDropdownVisible = ref(false)

const pageInfo = reactive({
  condition: {},
  currentPage: 1,
  pageSize: props.showPagination ? 10 : -1,
})

const visibleSelectOptions = computed(() => {
  return _.filter(selectOptions.value, (item) => !item.invisible)
})

watch(
  () => props.modelValue,
  () => {
    if (!props.multiple) {
      currentSelectOption.value = {
        label: props.label,
        value: props.modelValue,
      }
      return
    }
    if ($utils.isEmpty(props.modelValue)) {
      currentSelectOption.value = []
      return
    }
    const valueList =
      props.valueType === Constants.PAGING_SELECT_VALUE_COMMA ? props.modelValue.split(',') : props.modelValue
    const labelList = (props.label || '').split(',')

    currentSelectOption.value = _.map(valueList, (value, idx) => {
      return {
        label: labelList[idx],
        value,
      }
    })
  },
  { immediate: true },
)

watch(
  () => props.actionUrl,
  (newVal, oldVal) => {
    if (!_.isEqual(newVal, oldVal)) {
      needReload.value = true
    }
  },
)

watch(
  () => props.label,
  () => {
    isTooltipDisabled.value = !(!props.multiple && props.label)
  },
  { immediate: true },
)

const selectValue = computed({
  get: () => {
    if (currentSelectOption.value.value === '') {
      return ''
    }
    return currentSelectOption.value
  },
  set: (val) => {
    if (props.multiple) {
      emit(
        'update:modelValue',
        props.valueType === Constants.PAGING_SELECT_VALUE_COMMA ? _.map(val, 'value').join(',') : _.map(val, 'value'),
      )
      emit('update:label', _.map(val, 'label').join(','))
    } else {
      let modelValue = _.isUndefined(val) ? '' : val.value
      let label = _.isUndefined(val) ? '' : val.label
      if (isEmpty(modelValue) && props.allowCreate && isNotEmpty(val)) {
        modelValue = val
        label = val
      }
      emit('update:modelValue', modelValue)
      emit('update:label', label)
    }
  },
})

const maxHeight = computed(() => {
  if (_.isNumber(props.height)) {
    return props.height + 'px'
  }
  return props.height
})

const showEmptyTip = computed(() => selectOptions.value.length === 0 && selectFocusVisible.value)

watch(
  () => props.condition,
  (newVal, oldVal) => {
    if (!_.isEqual(newVal, oldVal)) {
      pageInfo.condition = _.cloneDeep(newVal)
      selectOptions.value = []
    }
  },
  { deep: true, immediate: true },
)

onMounted(async () => {
  if (props.autoFetch) {
    await filter()
  }
})

/**
 * 加载下拉页面
 * */
async function loadSelectPage() {
  let res = {} as Http.TPageRes
  if (isNotEmpty(props.actionUrl)) {
    res = (await apiUtils.getPage(props.actionUrl, pageInfo.condition, pageInfo)) as Http.TPageRes
  } else if (typeof props.action === 'function') {
    res = await props.action(pageInfo.condition, pageInfo)
    if (!_.has(res, 'records')) {
      Object.assign(res, { records: res as any[] })
    }
  }
  loading.value = true
  if (commonUtils.isResponseResult(res) && !(res as Http.IResponseResult).success) {
    return messageUtils.showResponseMessage(res)
  }
  let list = res.records
  if (typeof props.processData === 'function') {
    list = props.processData(res.records)
  }
  selectOptions.value = _.map(list, (item) =>
    _.assign(item, {
      label: item[props.optionLabelField],
      value: item[props.optionValueField],
    }),
  )
  total.value = res.totalRecord!
  pageCount.value = res.totalPage!
  loading.value = false
  await nextTick(() => {
    if (selectRef.value?.scrollbar) {
      selectRef.value.scrollbar.setScrollTop(0)
      if (props.controlsSelectHeight) {
        jq('.paging-select-popover').height(props.height)
      }
    }
  })
}

/**
 * 下拉面板显示事件
 * */
async function handleVisibleChange(visible) {
  selectDropdownVisible.value = visible
  /* console.log(
    'visible',
    visible,
    'query',
    selectRef.value.query,
    'props.optionLabelField',
    pageInfo.condition[props.optionLabelField],
    'needReload',
    needReload.value,
  )*/
  if (visible) {
    if (_.isFunction(props.beforeOpen) && !props.autoFetch) {
      const result = await props.beforeOpen()
      if (!result) {
        return selectRef.value.blur()
      }
    }
    if (needReload.value) {
      await filter()
      needReload.value = false
    }
    if (!props.onceRemote || commonUtils.isEmpty(selectRef.value.query) || !props.multiple) {
      await filter()
    }
  }
  selectFocusVisible.value = visible
}

function handleSelectChange(val) {
  needReload.value = true
  console.log('handleSelectChange', val)
  emit('change', val)
}

async function filter(keyword = '') {
  /* console.log(
    '【filter】',
    'query',
    selectRef.value.query,
    'keyword',
    keyword,
    props.optionLabelField,
    pageInfo.condition[props.optionLabelField],
  )*/
  pageInfo.condition[props.optionLabelField] = keyword
  jq('body').find('.paging-select-empty-con').remove()
  if ((props.onceRemote || !selectDropdownVisible.value) && !props.showPagination && selectOptions.value.length > 0) {
    return _.each(selectOptions.value, (item) => {
      item.invisible = !_.includes(item.label, keyword)
    })
  }
  if (props.showPagination) {
    if (!selectDropdownVisible.value) {
      return
    }
    pageInfo.currentPage = 1
  }
  await loadSelectPage()
}

/**
 * 下一页
 * */
async function fetchNext() {
  await loadSelectPage()
  nextTick(() => {
    document.addEventListener('keydown', handleKeyDown)
  })
}

/**
 * 上一页
 * */
async function fetchPrev() {
  await loadSelectPage()
  nextTick(() => {
    document.addEventListener('keydown', handleKeyDown)
  })
}

/**
 * 翻页
 * */
async function handleCurrentChange(page) {
  if (props.showPagination) {
    pageInfo.currentPage = page
    await loadSelectPage()
    nextTick(() => {
      document.addEventListener('keydown', handleKeyDown)
    })
  }
}

/**
 * 更改页条
 * */
async function changeSize(limit) {
  pageInfo.pageSize = limit
  await loadSelectPage()
}

function handleSelectAll() {
  if (props.multiple) {
    const values = _.map(selectOptions.value, 'value')
    emit('update:modelValue', props.valueType === Constants.PAGING_SELECT_VALUE_COMMA ? values.join(',') : values)
  }
}

function handleSelectReset() {
  emit('update:modelValue', props.valueType === Constants.PAGING_SELECT_VALUE_COMMA ? '' : [])
}

function handleKeyDown(event) {
  if (visibleSelectOptions.value.length && event.keyCode === 38) {
    // 上箭头
    selectRef.value.$el.querySelector('.el-input .el-input__inner').focus()
  } else if (visibleSelectOptions.value.length && event.keyCode === 40) {
    // 下箭头
    selectRef.value.$el.querySelector('.el-input .el-input__inner').focus()
  }
}
defineExpose({ loadSelectPage, selectOptions })
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
:deep(.el-select-dropdown .el-select-dropdown__item.selected) {
  background: transparent !important;
}
.option-con {
  &::-webkit-scrollbar-track-piece {
    background: #d3dce6;
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 20px;
    background: #99a9bf;
  }
}
.el-select-box {
  position: relative;
  .el-select {
    vertical-align: top;
    :deep(.el-input__inner) {
      height: 28px !important;
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.paging-select-popover {
  min-width: 350px;
  .el-scrollbar {
    padding-bottom: 40px;
  }
  .pagination {
    position: absolute;
    left: 0;
    bottom: 10px;
    margin-top: 0;
    width: 100%;
  }
}
.paging-select-empty-con {
  position: absolute;
  left: 0;
  top: calc(100% + 10px);
  z-index: 200;
  border: 1px solid var(--el-border-color-light);
  width: 100%;
  height: 40px;
  background: var(--el-color-white);
  box-shadow: var(--el-box-shadow-light);
  animation: select-height-move 0.2s;
  p {
    margin: 0;
    padding: 10px 0;
    text-align: center;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
  .arrow {
    position: absolute;
    left: 50%;
    top: -5px;
    z-index: 1;
    margin-left: -5px;
    width: 10px;
    height: 10px;
    &::before {
      position: absolute;
      right: 0;
      z-index: -1;
      box-sizing: border-box;
      border: 1px solid var(--el-border-color-light);
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      border-top-left-radius: 2px;
      width: 10px;
      height: 10px;
      background: var(--el-color-white);
      content: ' ';
      transform: rotate(45deg);
    }
  }
}
@keyframes select-height-move {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: 44px;
    opacity: 1;
  }
}
</style>
