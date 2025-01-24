<template>
  <el-dialog
    ref="dialogRef"
    v-model="visible"
    title="修改密码"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    top="30vh"
  >
    <el-form ref="formRef" :model="model" label-width="150px" :rules="rules">
      <el-row>
        <el-col :span="24">
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="model.newPassword" autocomplete="off" type="password" minlength="6" show-password />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="重复密码" prop="confirmNewPassword">
            <el-input v-model="model.confirmNewPassword" autocomplete="off" type="password" show-password />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item />
    </el-form>
    <footer>
      <div class="clearfix">
        <div class="fl" style="line-height: 40px; color: red">提示：首次登录必须修改默认密码才能进入系统</div>
        <div class="fr">
          <el-button type="primary" @click="confirm">确定</el-button>
          <el-button type="default" @click="reset">重置</el-button>
        </div>
      </div>
    </footer>
  </el-dialog>
</template>
<script setup>
import { useValidator } from '@/hooks/useValidator'

const emit = defineEmits(['update:visible'])

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})
const { visible } = toRefs(props)

const defaultFormData = {
  newPassword: '',
  confirmNewPassword: '',
}

const dialogRef = ref(null)
const formRef = ref(null)

const model = reactive({ ...defaultFormData })

const { newPassword, confirmNewPassword } = useValidator(formRef, model)

const rules = reactive({
  newPassword: [
    { min: 6, max: 30, message: '密码长度不能小于6位', trigger: 'blur' },
    { validator: newPassword, trigger: 'blur' },
  ],
  confirmNewPassword: [
    { min: 6, max: 30, message: '密码长度不能小于6位', trigger: 'blur' },
    { validator: confirmNewPassword, trigger: 'blur' },
  ],
})

async function confirm() {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const res = await $api.sys.userApi.updateDefaultPassword(model)
      await $utils.messageUtils.showResponseMessage(res).catch((e) => {
        throw e
      })
      emit('update:visible', false)
    }
  })
}

function reset() {
  formRef.value.resetFields()
  Object.assign(model, defaultFormData)
}
</script>
