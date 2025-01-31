<!--suppress HtmlUnknownAttribute, HtmlUnknownTag -->
<template>
  <el-upload
    ref="uploadRef"
    v-loading="loading"
    v-bind="$attrs"
    element-loading-text="正在上传文件，请稍候..."
    element-loading-background="rgba(255, 255, 255, 0.9)"
    class="multi-upload"
    :headers="apiUtils.getJwtHeaders()"
    :action="apiUtils.UPLOAD_URL"
    :before-upload="beforeUpload"
    :on-success="handleUploadSuccess"
    :on-error="handleUploadError"
    :on-remove="handleUploadRemove"
    :on-preview="downloadFile"
    :on-progress="handleUploadProgress"
    :data="formData"
    :multiple="multiple"
    :limit="limit"
    :file-list="files"
    :accept="accept"
    size="small"
    :disabled="disabled || !uploadEnabled"
  >
    <template #default>
      <div class="flex">
        <div v-if="uploadEnabled" class="">
          <el-button ref="btnUpload" type="primary" size="small" @click="onUploadButtonClick">
            <el-icon style="margin-left: -5px"><Upload /></el-icon>
            <span class="ml5">{{ buttonName }}</span>
          </el-button>
        </div>
        <div v-if="fileTip" class="upload-tip flex1" :style="!fileExplain ? 'margin-top:5px;' : 'margin-top: -3px;'">
          <span class="el-upload__tip">{{ fileTip }}</span>
          <template v-if="showRequiredTip">
            <span v-if="required" style="color: red">（必传）</span>
            <span v-else>（非必传）</span>
          </template>
          <p v-if="fileExplain">{{ fileExplain }}</p>
        </div>
      </div>
    </template>
    <template #file="{ file }">
      <div class="flex">
        <a class="file-item-name flex1">
          <div class="file-name">
            <el-icon class="name-icon"><Document /></el-icon>
            <span>{{ file.name }}</span>
          </div>
        </a>
        <div class="handle">
          <el-icon v-if="deletable" class="handle-icon" @click="handleRemoveFile(file)"><Close /></el-icon>
          （
          <el-link class="handle-txt" type="primary" @click="downloadFile(file)">下载</el-link>
          <el-link class="handle-txt ml10" type="primary" target="_blank" :href="getPreviewUrl(file)">预览</el-link>
          ）
        </div>
      </div>
      <el-progress
        v-if="$utils.isEmpty(file.id)"
        style="top: 35px"
        :text-inside="false"
        :stroke-width="10"
        :percentage="percentage"
        :show-text="false"
        status="success"
      >
        <span>{{ file.name }}</span>
      </el-progress>
    </template>
  </el-upload>
</template>
<script lang="ts">
export default {
  name: 'MultiUpload',
}
</script>
<script setup lang="ts">
interface IFile {
  id: string
  fileName: string
}

const emit = defineEmits(['before-upload', 'upload-success', 'upload-remove-success', 'upload-error'])

const props = defineProps({
  accept: {
    default: '',
    type: String,
  },
  autoFetch: {
    default: false,
    type: Boolean,
  },
  buttonName: {
    default: '点击上传',
    type: String,
  },
  deletable: {
    default: true,
    type: Boolean,
  },
  disabled: {
    default: false,
    type: Boolean,
  },
  fileExplain: {
    default: '',
    type: String,
  },
  fileList: {
    default: () => [],
    type: Array,
  },
  fileListStyle: {
    default: () => ({}),
    type: Object,
  },
  fileTip: {
    default: '',
    type: [String, Boolean],
  },
  formData: {
    default: () => ({
      bizId: '',
      bizType: '',
    }),
    type: Object,
  },
  limit: {
    default: 999,
    type: Number,
  },
  multiple: {
    default: true,
    type: Boolean,
  },
  required: {
    default: false,
    type: Boolean,
  },
  showRequiredTip: {
    default: false,
    type: Boolean,
  },
  showUploadButton: {
    default: true,
    type: Boolean,
  },
})

const { formData, fileList } = toRefs(props)

const files = ref([])
const uploadRef = ref(null)
const loading = ref(false)
const percentage = ref(0)

const uploadEnabled = computed(() => props.showUploadButton && props.limit > files.value.length)

watchEffect(() => {
  files.value = _.map(fileList.value, (file: IFile) => {
    return {
      id: file.id,
      name: file.fileName,
      url: `${apiUtils.DOWNLOAD_URL}?id=${file.id}`,
    }
  })
})

watch(
  () => formData.value.bizId,
  () => {
    if (props.autoFetch && $utils.isNotEmpty(formData.value.bizId) && files.value.length === 0) {
      loadFileList()
    }
  },
  { immediate: true },
)

async function loadFileList() {
  const list = await $api.file.fileApi.findFileList(formData.value)
  files.value = _.map(list, (file) => {
    return {
      id: file.id,
      name: file.fileName,
    }
  })
}

async function handleRemoveFile(file) {
  await $utils.messageUtils.confirm('确定删除该文件吗?')
  const res = await apiUtils.removeFile(file.id)
  await $utils.messageUtils.showResponseMessage(res)
  await uploadRef.value.handleRemove(file, null)
}

function beforeUpload() {
  emit('before-upload')
  loading.value = true
  return true
}

async function handleUploadSuccess(res, file, uploadFiles) {
  try {
    await $utils.messageUtils.showResponseMessage(res).catch((e) => {
      throw e
    })
    _.find(uploadFiles, { uid: file.uid }).id = res.info.id
    emit('upload-success', { file, formData, uploadFiles })
  } catch (e) {
    await uploadRef.value.handleRemove(file, null)
    console.error(e)
  } finally {
    loading.value = false
    percentage.value = 0
  }
}

async function handleUploadError(error) {
  loading.value = false
  await $utils.messageUtils.showResponseErrorMessage(`上传失败！${JSON.parse(error.message).message}`)
  emit('upload-error')
}

function handleUploadRemove(file, uploadFiles) {
  emit('upload-remove-success', { file, formData, uploadFiles })
}

function handleUploadProgress(e) {
  percentage.value = e.percent
}

async function downloadFile(file) {
  await apiUtils.downloadFile(file.id)
}
function getPreviewUrl(file) {
  return $utils.getApiUrl() + '/file/preview.json?id=' + file.id
}
async function onUploadButtonClick() {
  /* if (_.isEmpty(formData.value.bizId)) {

  }*/
}

defineExpose({ loadFileList, uploadFiles: files })
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
:deep(.el-upload) {
  text-align: left;
  .el-upload__tip {
    display: inline-block;
    margin-top: 0;
    line-height: 20px;
    font-size: 12px;
    color: #999;
  }
  .upload-tip {
    margin-left: 10px;
    line-height: 20px;
    font-size: 12px;
    color: #999;
  }
}
:deep(.file-item-name) {
  padding-left: 5px;
  max-width: calc(100% - 125px);
  .el-icon {
    color: var(--el-text-color-secondary);
  }
  span {
    margin-left: 5px;
    color: var(--el-color-primary);
  }
}
.upload-list {
  li {
    .handle-icon {
      display: inline-block;
      padding: 0 0 0 3px;
      cursor: pointer;
      vertical-align: -2px;
    }
    .handle {
      font-size: 12px;
    }
    .handle-txt {
      display: inline-block;
      cursor: pointer;
      font-size: 12px;
      color: #409eff;
    }
    .name-icon {
      vertical-align: -2px;
    }
  }
}
.multi-upload {
  :deep(.el-upload-list__item) {
    transition: none;
    .el-icon {
      vertical-align: -2px;
    }
  }
  :deep(.el-upload-list__item.is-uploading, .el-upload-list__item.is-ready) {
    margin-bottom: 10px;
  }
  .file-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  :deep(.el-upload--text) {
    display: block;
    line-height: 1;
  }
}
</style>
