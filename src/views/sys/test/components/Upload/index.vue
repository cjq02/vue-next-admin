<template>
  <el-row class="mb20">
    <h2 class="mb10">原生element upload</h2>
    <el-col :span="8">
      <el-upload
        class="upload-file"
        action="http://test.projectctrl.jiujiezixun.com/test-api/file/tempUpload.json"
        :data="formData"
        :file-list="fileList"
        :on-success="handleUploadSuccess"
      >
        <el-button type="primary">点击上传</el-button>
      </el-upload>
    </el-col>
  </el-row>
  <el-row class="mb20">
    <el-col :span="8">
      <h2 class="mb10">multi upload</h2>
      <multi-upload
        ref="uploadDirRef"
        accept=".jpg,.jpeg,.png,.pdf"
        v-bind="$attrs"
        file-tip="文件类型：图片/PDF"
        show-required-tip
        required
        :form-data="{ bizId: '12345678901234567890123456789012', bizType: Code.FILE_BIZ_TYPE._1 }"
      />
    </el-col>
  </el-row>
  <el-row class="mb20">
    <h2 class="mb10">原生文件夹上传</h2>
    <el-col :span="8">
      <input
        ref="uploadDirRef"
        class="fileUploaderClass"
        type="file"
        name="file"
        webkitdirectory
        @change.stop="changesData"
      />
      <!--      <el-button @click="uploadFile">上传</el-button>-->
    </el-col>
  </el-row>
</template>
<script>
export default {
  label: '上传',
}
</script>
<script setup>
import axios from 'axios'

const { proxy } = getCurrentInstance()

/** ------------------------------------
 * 原生element upload
 *  ------------------------------------ */

const formData = reactive({ bizType: '00' })
const fileList = ref([])

function handleUploadSuccess(res) {
  proxy.$message(res.message)
}

/** ------------------------------------
 * 上传文件夹
 *  ------------------------------------ */

const uploadDirRef = ref(null)
const dirFileList = ref([])

function changesData() {
  console.log(uploadDirRef.value.files)
  // 获取 file list
  dirFileList.value = uploadDirRef.value.files
  uploadFile()
}

function uploadFile() {
  const formData = new window.FormData()
  // 每个 file append 到 formData 里
  for (let i = 0; i < dirFileList.value.length; i++) {
    formData.append('files', dirFileList.value[i])
  }
  const url = apiUtils.uploadDirUrl
  axios({
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    url: url,
  }).then(function (res) {})
}
</script>
