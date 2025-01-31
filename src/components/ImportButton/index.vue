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
    :headers="getJwtHeaders()"
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
import { getToken } from '@/utils/auth'

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
    default: null,
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
const uploadLoading = ref(null)
const importAction = computed(() => {
  return apiUtils.API_PREFIX + props.action
})
function importDone(res) {
  if (uploadLoading.value) {
    uploadLoading.value.close()
  }
  if (_.isEmpty(res.message) && res.success) {
    res.message = '导入成功'
  }
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

/**
 * 额外的jwt headers参数
 */
const getJwtHeaders = () => {
  const headers = {
    'Global-Device': 'web',
    'Global-Device-UUID': $utils.auth.getFpId(),
    'Global-Version': '1',
  }
  const token = getToken()
  if (token) {
    Object.assign(headers, { Authorization: token })
  }
  return headers
}
const beforeUpload = (file) => {
  if (props.beforeUpload && typeof props.beforeUpload === 'function') {
    if (!props.beforeUpload(file)) {
      return false
    }
  }
  uploadLoading.value = Loading.service({
    target: '.app-container',
    text: '数据导入中，请稍等...',
  })
  return true
}

defineExpose({ submitUpload })
</script>
