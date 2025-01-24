<template>
  <FormWrapper ref="formWrapper" :title="title" @after-back="afterBack">
    <template #container>
      <el-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-width="120px"
        label-position="right"
        style="padding: 30px 30px 10px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题" prop="title">
              <el-input v-model="model.title" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="说明" prop="remark">
              <el-input
                v-model="model.remark"
                minlength="1"
                :rows="5"
                type="textarea"
                maxlength="500"
                :autosize="{ minRows: 3, maxRows: 5 }"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容" prop="content">
              <t-editor ref="editor" v-model="model.content" :bottom-offset-height="40" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template #footer>
      <el-button v-show="model.status === Code.ANNOUNCE_STATUS._0" type="primary" size="default" @click="saveDraft">
        保存草稿
      </el-button>
      <el-button v-show="model.status === Code.ANNOUNCE_STATUS._0" type="success" size="default" @click="submit">
        发布
      </el-button>
      <el-button size="default" @click="back">关闭</el-button>
    </template>
  </FormWrapper>
</template>
<script setup>
import { baseEmits } from '@/hooks/useBaseForm'

const emit = defineEmits(baseEmits)

const defaultFormData = {
  id: '',
  title: '',
  content: '',
  remark: '',
  status: Code.ANNOUNCE_STATUS._0,
}

// noinspection JSUnusedGlobalSymbols
const { formWrapper, formRef, model, title, open, back, afterBack } = useBaseForm(
  {
    defaultFormData,
    getAction: $api.sys.announceApi.getAnnounceById,
    saveAction: $api.sys.announceApi.saveAnnounce,
  },
  emit,
)

const rules = reactive({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
})

async function saveDraft() {
  const res = await save(Code.ANNOUNCE_STATUS._0)
  if (res.success) {
    Object.assign(model, res.info)
    emit('save-success')
  }
}

async function submit() {
  await $utils.messageUtils.confirm('确定发布吗？')
  const res = await save(Code.ANNOUNCE_STATUS._1)
  if (res.success) {
    back()
    emit('save-success')
  }
}

async function save(status) {
  try {
    await formRef.value.validate()
    const requestData = _.extend({}, model, { status })
    const res = await $api.sys.announceApi.saveAnnounce(requestData)
    await $utils.messageUtils.showResponseMessage(res).catch((e) => {
      throw e
    })
    return res
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

defineExpose({ open })
</script>
<style lang="scss" scoped>
:deep(.el-col:last-child) {
  div.el-form-item {
    margin-bottom: 0 !important;
  }
}
</style>
