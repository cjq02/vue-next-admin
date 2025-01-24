<template>
  <div class="login-container">
    <div class="title-container titles">
      <h3 class="title">{{ store.app.settings.title }}</h3>
    </div>
    <div id="login-info" class="login-info">
      <div class="login-con clearfix">
        <div class="login-pic fr">
          <img alt class="pic" src="@/assets/img/login/login-pic.png" />
        </div>
        <div class="login-form fr">
          <div class="txt">登录</div>
          <el-form ref="formRef" :model="model" :rules="loginRules" auto-complete="on" label-position="left">
            <el-form-item prop="username">
              <div class="flex">
                <label class="lab" v-html="'账&nbsp;&nbsp;&nbsp;&nbsp;号'"></label>
                <el-input
                  v-model="model.username"
                  class="flex1"
                  placeholder="请输入账号"
                  name="账号"
                  type="text"
                  auto-complete="on"
                />
              </div>
            </el-form-item>

            <el-form-item prop="password">
              <div class="flex">
                <label class="lab" v-html="'密&nbsp;&nbsp;&nbsp;&nbsp;码'"></label>
                <el-input
                  v-model="model.password"
                  :type="pwdType"
                  placeholder="请输入密码"
                  name="password"
                  auto-complete="on"
                  @keyup.enter="doLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <el-icon :size="20"><View /></el-icon>
                </span>
              </div>
            </el-form-item>
            <el-form-item v-if="showCaptcha" prop="captcha" :rules="captchaRules">
              <div class="flex">
                <label class="lab" v-html="'验证码'"></label>
                <el-input
                  v-model="model.captcha"
                  placeholder="请输入验证码"
                  name="验证码"
                  type="text"
                  auto-complete="on"
                />
                <img class="imgCaptcha" alt="" :src="captchaSrc" @click="refreshCaptcha" />
              </div>
            </el-form-item>
            <el-button class="login-btn" :loading="loading" type="primary" style="width: 100%" @click.prevent="doLogin">
              <span v-html="'登&nbsp;&nbsp;录'"></span>
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
    <div class="login-bottom">Copyright © 九阶（北京）信息科技有限公司</div>
  </div>
</template>
<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
}
</script>
<script setup>
import RSA from '@/utils/rsa'

const store = useStore()
const route = useRoute()
const router = useRouter()

const SHOW_CAPTCHA_COUNT = 3

const formRef = ref(null)
const loading = ref(false)
const pwdType = ref('password')
const redirect = ref('/home')
const showCaptcha = ref(false)
const captchaSrc = ref('')

const model = reactive({
  username: '',
  password: '',
  captcha: '',
})

const loginRules = reactive({
  username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
})

const captchaRules = computed(() => {
  return [
    { required: showCaptcha.value, message: '验证码不能为空', trigger: 'blur' },
    { len: 4, message: '验证码长度必须是4位', trigger: 'blur' },
  ]
})

onMounted(async () => {
  doRedirect()
  setPageStyle()
  showCaptcha.value = (await $api.loginApi.getLoginFailCount()) >= SHOW_CAPTCHA_COUNT
  captchaSrc.value = getCaptchaSrc()
})

function setPageStyle() {
  const loginInfo = document.getElementById('login-info')
  const title = document.getElementsByClassName('titles')[0]
  const top = (jq(window).height() - jq(loginInfo).height()) / 2.5
  const titleTop = (top - jq(title).height()) / 2 + 60
  // jq(loginInfo).css({ 'marginTop': top });
  jq(title).css({ top: titleTop })
}

function doRedirect() {
  if (route.query.redirect) {
    redirect.value = route.query.redirect
  }
}

function showPwd() {
  pwdType.value = pwdType.value === 'password' ? '' : 'password'
}

async function getEncryptPassword() {
  const res = await $api.loginApi.getEncryptKey()
  const data = res.info
  const encryptKey = RSA.getRSAKeyPair(130, data.rsaExponent, '', data.rsaModule)
  return RSA.encryptedString(encryptKey, model.password)
}

async function doLogin() {
  try {
    await formRef.value.validate()
    loading.value = true
    const password = await getEncryptPassword()
    const requestData = Object.assign({}, model, { password })
    await store.user.login(requestData).catch((res) => {
      if (res.info >= SHOW_CAPTCHA_COUNT) {
        refreshCaptcha()
        showCaptcha.value = true
      }
      throw res.message
    })
    await router.push({ path: redirect.value })
  } catch (e) {
    console.error('校验失败，结果：', e)
  } finally {
    loading.value = false
  }
}

function getCaptchaSrc() {
  return $utils.getApiUrl() + '/captchaServlet?name=login&ver=' + new Date().getTime()
}

function refreshCaptcha() {
  captchaSrc.value = getCaptchaSrc()
}
</script>
<style rel="stylesheet/scss" lang="scss" src="./login.scss"></style>

<style lang="scss" scoped>
.login-container {
  :deep(.el-input__inner) {
    color: #333 !important;
  }
  :deep(.el-form-item__error) {
    left: 40px;
  }
}
.imgCaptcha {
  position: absolute;
  right: 25px;
  width: 80px;
  height: 40px;
}
</style>
