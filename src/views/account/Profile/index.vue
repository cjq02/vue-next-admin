<template>
  <d2-container>
    <div class="app-container">
      <h3>基本信息</h3>
      <el-divider />
      <el-row>
        <el-col :span="18" style="padding-left: 10px">
          <el-form :label-width="labelWidth">
            <el-form-item label="姓名">
              <span>{{ user.realName }}</span>
            </el-form-item>
            <el-form-item label="工号">
              <span>{{ user.jobNo }}</span>
            </el-form-item>
            <el-form-item label="手机">
              <span>{{ user.phone }}</span>
            </el-form-item>
            <el-form-item label="权限">
              <span>{{ roleNames }}</span>
            </el-form-item>
            <el-form :label-width="labelWidth">
              <el-form-item label="企业">
                <span>{{ user.corpName }}</span>
              </el-form-item>
            </el-form>
            <el-form :label-width="labelWidth">
              <el-form-item label="部门">
                <span>{{ user.deptName }}</span>
              </el-form-item>
            </el-form>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </d2-container>
</template>
<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Profile',
}
</script>
<script setup>
const store = useStore()

const labelWidth = ref('100px')
const user = ref({})

const roleNames = computed(() => {
  if (!user.value.roleNames) {
    return ''
  }
  return user.value.roleNames.join('、')
})

onMounted(() => {
  user.value = store.user.userInfo
})
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
