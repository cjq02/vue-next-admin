<template>
  <div class="errPage-container">
    <el-button class="pan-back-btn" @click="back">返回</el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">Oops!</h1>
        gif来源
        <a href="https://zh.airbnb.com/" target="_blank">airbnb</a>
        页面
        <h2>你没有权限去该页面</h2>
        <h6>如有不满请联系你领导</h6>
        <ul class="list-unstyled">
          <li>或者你可以去:</li>
          <li class="link-type">
            <router-link to="/home">回首页</router-link>
          </li>
          <li class="link-type">
            <a href="https://www.taobao.com/">随便看看</a>
          </li>
          <li><a href="#" @click.prevent="dialogVisible = true">点我看图</a></li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream." />
      </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" title="随便看">
      <img :src="ewizardClap" class="pan-img" />
    </el-dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, toRefs } from 'vue'

import errGif from '@/assets/401_images/401.gif'

const { proxy } = getCurrentInstance()

const state = reactive({
  errGif: errGif + '?' + +new Date(),
  ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
  dialogVisible: false,
})

const back = () => {
  if (proxy.$route.query.noGoBack) {
    proxy.$router.push({ path: '/home' })
  } else {
    proxy.$router.go(-1)
  }
}
// 导出属性到页面中使用
const { ewizardClap, dialogVisible } = toRefs(state)
</script>

<style lang="scss" scoped>
.errPage-container {
  margin: 100px auto;
  width: 800px;
  max-width: 100%;
  .pan-back-btn {
    border: none !important;
    background: #008489;
    color: #fff;
  }
  .pan-gif {
    display: block;
    margin: 0 auto;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
  .text-jumbo {
    font-weight: 700;
    font-size: 60px;
    color: #484848;
  }
  .list-unstyled {
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      text-decoration: none;
      color: #008489;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
