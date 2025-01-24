<template>
  <FormWrapper ref="formWrapper" :title="title" @after-back="afterBack">
    <template #container>
      <el-form ref="formRef" :model="model" :rules="rules" label-width="120px" style="padding: 30px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="model.name" minlength="1" placeholder="请输入单位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编号" prop="code">
              <el-input v-model="model.code" minlength="1" placeholder="请输入编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="简称" prop="shortName">
              <el-input v-model="model.shortName" minlength="1" placeholder="请输入单位简称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父级单位" prop="parentCorpId">
              <el-tree-select
                v-model="model.parentCorpId"
                no-results-text="无匹配数据"
                :data="corpTreeOptions"
                placeholder="请选择父级单位"
                clearable
                check-strictly
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template #footer>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="back">关闭</el-button>
    </template>
  </FormWrapper>
</template>
<script>
import { baseEmits, useBaseForm } from '@/hooks/useBaseForm'

const emits = baseEmits
</script>
<script setup>
const emit = defineEmits(emits)

const defaultFormData = {
  id: '',
  jobNo: '',
  userName: '',
  realName: '',
  active: TRUE,
  phone: '',
  corpId: '',
  roleIds: [],
  departmentId: '',
  roleTypes: [],
  assignDepartments: '',
  positionName: '',
  education: '',
  entryTs: '',
}

const options = {
  defaultFormData,
  getAction: $api.sys.corpApi.getCorpById,
  saveAction: $api.sys.corpApi.save,
}

// noinspection JSUnusedGlobalSymbols
const { formWrapper, formRef, model, title, save, open, back, afterBack } = useBaseForm(options, emit)

const rules = reactive({
  name: [
    { required: true, message: '请输入单位名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
  shortName: [{ required: true, message: '请输入单位简称', trigger: 'blur' }],
})

onMounted(async () => {})

const getCorpTreeOptions = inject('getCorpTreeOptions')

const corpTreeOptions = computed(() => {
  return getCorpTreeOptions()
})

defineExpose({ open })
</script>
<style scoped></style>
