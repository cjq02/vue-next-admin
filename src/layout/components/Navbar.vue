<template>
  <div class="navbar rowBC">
    <div class="rowSC">
      <hamburger
        v-if="settings.showHamburger"
        :is-active="opened"
        class="hamburger-container"
        @toggle-click="toggleSideBar"
      />
      <!-- <breadcrumb class="breadcrumb-container" />-->
      <span class="navbar-tip">{{ settings.title }}</span>
    </div>
    <!--nav title-->
    <div v-if="settings.showNavbarTitle" class="heardCenterTitle">{{ settings.title }}</div>
    <div v-if="settings.showDropdown" class="right-menu rowSC">
      <el-button style="margin-top: 5px" type="primary" text @click="downloadFile">操作手册</el-button>
      <el-button style="margin-top: 5px" type="primary" text class="ml20 mr10" @click="dialogVisible = true">
        咨询电话
      </el-button>
      <!--      <SizeSelect />-->
      <!--      <LangSelect />-->
      <el-dropdown class="avatar-container right-menu-item" size="default" trigger="click">
        <div class="avatar-wrapper">
          <span>{{ name }}</span>
          <el-icon :size="16" color="#666">
            <caretBottom></caretBottom>
          </el-icon>
          <i class="el-icon-caret-bottom" />
        </div>
        <template #dropdown>
          <el-dropdown-menu class="right-menu-drop">
            <router-link to="/account/profile">
              <el-dropdown-item>个人资料</el-dropdown-item>
            </router-link>
            <router-link to="/account/updatePwd">
              <el-dropdown-item>修改密码</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span style="display: block" @click="logout">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div style="display: inline-block" class="mr20"><ScreenFull /></div>
    </div>
    <el-dialog v-model="dialogVisible" width="400px" :show-close="false" custom-class="">
      <div style="line-height: 30px; font-size: 16px">
        系统使用过程中，有任何问题请您及时联系我们。咨询电话：
        <em style="margin: 0 5px 0 0; color: #e56c37">13333812928</em>
      </div>
      <div class="tc" style="margin-top: 30px"><el-button @click="dialogVisible = false">关 闭</el-button></div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

import ScreenFull from '@/components/ScreenFull/index.vue'

import Hamburger from './Hamburger'

const state = reactive({
  dialogVisible: false,
})
const store = useStore()
const router = useRouter()

const name = computed(() => store.user.userInfo?.realName)
const settings = computed(() => store.app.settings)
const opened = computed(() => store.app.sidebar.opened)
const toggleSideBar = () => store.app.toggleSideBar()
/*
 * 退出登录
 * */
const logout = () => {
  store.user.logout().then(async () => {
    ElMessage({ message: '退出登录成功', type: 'success' })
    await store.tagsView.delAllViews()
    await router.push({ path: '/login' })
    // 此处reload清空路由和重置部分状态
    /* location.reload();*/
  })
}
const downloadFile = () => apiUtils.download('/template/operationManual.pdf', { name: 'Admin System操作手册 V1.1.pdf' })
const { dialogVisible } = toRefs(state)
</script>
<!--suppress CssUnknownTarget -->
<style rel="stylesheet/scss" lang="scss" scoped>
.right-menu-drop {
  padding: 10px 0;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgb(0, 0, 0, 0.1);
  a {
    display: block;
  }
  .el-dropdown-menu__item {
    display: block;
    padding: 0 20px;
    line-height: 36px;
    font-size: 14px;
    &--divided::before {
      display: none;
    }
  }
}
.navbar {
  border-radius: 0 !important;
  height: 50px;
  line-height: 50px;
  .navbar-tip {
    float: left;
    height: 50px;
    line-height: 53px;
    font-size: 18px;
    color: #00255c;
  }
  .hamburger-container {
    float: left;
    padding: 0 10px;
    height: 50px;
    cursor: pointer;
    line-height: 50px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      margin-right: 10px;
      height: 50px;
      .avatar-wrapper {
        position: relative;
        margin-top: 12px;
        height: 30px;
        line-height: 30px;
        .user-avatar {
          float: left;
          border-radius: 10px;
          width: 30px;
          height: 30px;
          cursor: pointer;
        }
        span {
          float: left;
          margin-left: 10px;
          cursor: pointer;
          line-height: 30px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -18px;
          top: 8px;
          cursor: pointer;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
