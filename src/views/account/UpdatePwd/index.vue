<template>
  <d2-container>
    <div class="app-container">
      <h3>修改密码</h3>
      <el-divider />
      <el-row style="">
        <el-col :span="18" style="padding-left: 10px">
          <el-form ref="formRef" :model="model" label-width="150px" :rules="rules">
            <el-row>
              <el-col :span="24">
                <el-form-item label="原密码">
                  <el-input v-model="model.oldPassword" type="password" auto-complete="false" show-password />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="model.newPassword" type="password" minlength="5" show-password />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="重复密码" prop="confirmNewPassword">
                  <el-input v-model="model.confirmNewPassword" type="password" show-password />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item />
          </el-form>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <div class="btn-wrap tc">
        <el-button type="primary" @click="updatePwd">保存</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </template>
  </d2-container>
</template>
<script>
export default {
  name: 'UpdatePwd',
}
</script>
<script setup>
import { useValidator } from '@/hooks/useValidator'

const formRef = ref(null)

const model = reactive({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

const rules = reactive({
  newPassword: [
    { min: 6, max: 30, message: '密码长度不能小于6位', trigger: 'blur' },
    { validator: useValidator.newPassword, trigger: 'blur' },
  ],
  confirmNewPassword: [
    { min: 6, max: 30, message: '密码长度不能小于6位', trigger: 'blur' },
    { validator: useValidator.confirmNewPassword, trigger: 'blur' },
  ],
})

async function updatePwd() {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const res = await $api.sys.userApi.updatePassword(model)
      await $utils.messageUtils.showResponseMessage(res).catch((e) => {
        throw e
      })
    }
  })
}

function reset() {
  formRef.value.resetFields()
  Object.assign(model, this.$options.data().form)
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.user {
  padding: 10px;
}
.user > strong {
  font-weight: 400;
  font-size: 15px;
  color: #777;
}
.user > small {
  color: #9e9e9e;
}
.user-content {
  min-height: 500px;
  box-shadow: 2px 2px 4px #edecec;
}
.user-content > .profile {
  padding: 10px;
  width: 220px;
  height: 500px;
  background: #edecec;
}
.user-content > .profile > img {
  width: 100%;
}
</style>
