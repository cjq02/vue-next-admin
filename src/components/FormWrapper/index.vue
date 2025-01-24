<template>
  <transition name="edit">
    <d2-container v-if="visible" ref="formRef" v-loading="loading" class="edit-panel">
      <template v-if="showHeader" #header>
        <div v-if="!existsSlotHeader">
          <div v-show="showBack" class="fl pointer" @click="back">
            <back-icon class="el-icon pointer mr10 back"></back-icon>
            <span class="fs16">返回</span>
          </div>
          <div class="tc fs16">{{ formFlag }}{{ title }}</div>
        </div>
        <slot name="header"></slot>
      </template>
      <el-scrollbar v-if="scrollbarEnabled" :always="alwaysShowScrollbar">
        <slot name="container" />
      </el-scrollbar>
      <slot v-else name="container" />
      <template #footer>
        <div class="btn-wrap tc">
          <slot name="footer" />
        </div>
      </template>
    </d2-container>
  </transition>
</template>

<script>
export default {
  name: 'FormWrapper',
}
</script>
<script setup>
import { Back as BackIcon } from '@element-plus/icons-vue'

const emit = defineEmits(['after-open', 'after-back'])

const props = defineProps({
  showHeader: {
    type: Boolean,
    default: true,
  },
  showBack: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
  flag: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  alwaysShowScrollbar: {
    type: Boolean,
    default: true,
  },
  scrollbarEnabled: {
    type: Boolean,
    default: true,
  },
})

const { proxy } = getCurrentInstance()

const formRef = ref(null)
const formFlag = ref(props.flag)
const visible = ref(false)
const isEdit = ref(false)

const existsSlotHeader = computed(() => {
  return !!proxy.$slots.header
})

const containerHeight = computed(() => {
  return formRef.value?.$el.querySelector('.d2-container-full__body').clientHeight
})

/**
 * 打开
 * */
async function open(callback) {
  visible.value = true
  emit('after-open')
  if (callback) {
    const loading = proxy.$loading({
      target: '.app-container',
      text: '正在加载数据，请稍候...',
    })
    await callback()
    loading.close()
  }
}

/**
 * 返回
 * */
function back() {
  visible.value = false
  emit('after-back')
}

/**
 * 获取新增或编辑标识
 * */
const getAddOrEditFlag = (id) => (!_.isEmpty(id) ? Constants.formFlag.EDIT : Constants.formFlag.ADD)

defineExpose({
  formFlag,
  visible,
  isEdit,
  existsSlotHeader,
  containerHeight,
  open,
  back,
  getAddOrEditFlag,
})
</script>
<style>
.back {
  display: inline-block;
  margin-top: 2px;
  width: 1.2em;
  height: 1.2em;
  vertical-align: top;
}
</style>
