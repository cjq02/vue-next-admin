<template>
  <FormWrapper ref="formWrapper" :title="title" :loading="loading" @after-back="afterBack">
    <template #container>
      <el-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-width="120px"
        label-position="right"
        style="padding: 30px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="model.userName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="初始密码">
              <span>{{ defaultPassword }}</span>
              <el-link v-show="!$utils.isEmpty(model.id)" type="primary" class="ml5 mr5" @click="resetPassword">
                重置密码
              </el-link>
              <span>用户可进入个人中心修改密码</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号" prop="jobNo">
              <el-input v-model="model.jobNo" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="model.realName" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机" prop="phone">
              <el-input v-model="model.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleIds">
              <el-select v-model="model.roleIds" placeholder="请选择用户角色" multiple>
                <el-option
                  v-for="item in roleOptions"
                  :key="item.value"
                  :label="item.label"
                  :disabled="item.disabled"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="checkRole([Code.ROLE_TYPE._01])" :span="12">
            <el-form-item label="企业" prop="corpId">
              <el-tree-select
                v-model="model.corpId"
                no-results-text="无匹配数据"
                :data="corpTreeOptions"
                placeholder="请选择"
                clearable
                :check-strictly="true"
                @change="handleCorpChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="departmentId">
              <paging-select
                v-model="model.departmentId"
                v-model:label="model.deptName"
                placeholder="请选择"
                :condition="{ corpId: model.corpId }"
                action-url="/sys/dept/getPage.json"
                option-value-field="id"
                option-label-field="name"
              ></paging-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="active">
              <el-switch v-model="model.active" :active-value="TRUE" :inactive-value="FALSE" />
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
<script lang="ts">
import { baseEmits } from '@/hooks/useBaseForm'

const emits = baseEmits
</script>
<script setup lang="ts">
import { usePermission } from '@/hooks/usePermission'
import { regExp } from '@/utils/validate'

const emit = defineEmits(emits)
const { checkRole } = usePermission()

const defaultFormData = {
  active: TRUE,
  assignDepartments: '',
  corpId: '',
  departmentId: '',
  deptName: '',
  education: '',
  entryTs: '',
  id: '',
  jobNo: '',
  phone: '',
  positionName: '',
  realName: '',
  roleIds: [],
  roleTypes: [],
  userName: '',
}

const options = {
  defaultFormData,
  getAction: $api.sys.userApi.getUserById,
  saveAction: $api.sys.userApi.saveUser,
}

// noinspection JSUnusedGlobalSymbols
const { formWrapper, formRef, model, title, loading, save, open, back, afterBack } = useBaseForm(options, emit)

const rules = reactive({
  corpId: [{ message: '请选择企业', required: true, trigger: 'blur' }],
  departmentId: [{ message: '请选择部门', required: true, trigger: 'blur' }],
  jobNo: [
    { message: '请填写工号', required: false, trigger: 'blur' },
    { max: 50, message: '长度在 2 到 50 个字符', min: 2, trigger: 'blur' },
  ],
  phone: [
    { message: '请填写手机号', required: true, trigger: 'blur' },
    { message: '手机号格式不正确', pattern: regExp.mobile, trigger: 'blur' },
  ],
  realName: [
    { message: '请填写姓名', required: true, trigger: 'blur' },
    { max: 20, message: '长度在 2 到 20 个字符', min: 2, trigger: 'blur' },
  ],
  roleIds: [{ message: '请选择权限', required: true, trigger: 'blur' }],
})

const defaultPassword = ref(null)

onMounted(async () => {
  defaultPassword.value = await $api.sys.userApi.getDefaultPassword()
})

const getRoleOptions = inject('getRoleOptions') as any
const getCorpTreeOptions = inject('getCorpTreeOptions') as any

const roleOptions = computed(() => getRoleOptions())
const corpTreeOptions = computed(() => getCorpTreeOptions())

async function resetPassword() {
  await $utils.messageUtils.confirm(`确定重置密码为${defaultPassword}吗？`)
  const res = await $api.sys.userApi.resetPassword(model.id)
  await $utils.messageUtils.showResponseMessage(res)
  back!()
}

function handleCorpChange() {
  model.departmentId = ''
  model.deptName = ''
}

defineExpose({ open })
</script>
<style scoped></style>
