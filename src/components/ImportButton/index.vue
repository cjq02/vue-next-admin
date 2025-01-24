<template>
  <el-upload
    ref="uploadRef"
    class="vt"
    style="display: inline-block; margin-left: 10px; line-height: 28px"
    :action="importAction"
    :auto-upload="autoUpload"
    :show-file-list="showFileList"
    accept="application/vnd.ms-excel"
    :on-success="importDone"
    :data="formData"
    :before-upload="beforeUpload"
    :on-change="handleChange"
  >
    <el-button class="btn-upload" :type="type" :plain="plain" :size="size" :icon="icon">{{ buttonText }}</el-button>
  </el-upload>
</template>
<script lang="ts">
export default {
  name: 'ImportButton',
}
</script>
<script setup lang="ts">
const emit = defineEmits(['import-success', 'import-error', 'import-completed', 'import-change'])

const props = defineProps({
  action: {
    default: '',
    type: String,
  },
  autoUpload: {
    default: true,
    type: Boolean,
  },
  beforeUpload: {
    default: () => {},
    type: Function,
  },
  buttonText: {
    default: '导入',
    type: String,
  },
  formData: {
    default: () => {},
    type: Object,
  },
  icon: {
    default: 'Upload',
    type: String,
  },
  plain: {
    default: true,
    type: Boolean,
  },
  showFileList: {
    default: false,
    type: Boolean,
  },
  size: {
    default: 'small',
    type: String,
  },
  type: {
    default: 'primary',
    type: String,
  },
})
const uploadRef = ref()
const importAction = computed(() => {
  return apiUtils.API_PREFIX + props.action
})

function importDone(res) {
  $utils.messageUtils
    .showResponseMessage(res)
    .then((res) => {
      emit('import-success', res)
    })
    .catch((res) => {
      emit('import-error', res)
    })
    .finally((res) => {
      emit('import-completed', res)
    })
}
function handleChange(file, fileList) {
  emit('import-change', file, fileList)
}
const submitUpload = () => {
  if (!props.autoUpload) {
    uploadRef.value.submit()
  }
}
defineExpose({ submitUpload })
</script>
