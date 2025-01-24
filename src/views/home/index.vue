<template>
  <div class="home-container-box">
    <d2-container>
      <div class="home-box">
        <div class="home-top">
          <el-row :gutter="10">
            <el-col :span="12" class="channel channel-box1">
              <div class="flex inner">
                <label class="tit">系统管理</label>
                <div class="channelLink">
                  <el-link
                    v-for="(item, idx) in moduleList(modules.list1)"
                    :key="idx"
                    :underline="false"
                    class="link"
                    @click="$router.push(item.path)"
                  >
                    <i class="iconfont" :class="item.icon" />
                    <em>{{ item.title }}</em>
                  </el-link>
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="channel channel-box2">
              <div class="flex inner">
                <label class="tit">计划分解</label>
                <div class="channelLink">
                  <el-link
                    v-for="(item, idx) in moduleList(modules.list2)"
                    :key="idx"
                    :underline="false"
                    class="link"
                    @click="$router.push(item.path)"
                  >
                    <i class="iconfont" :class="item.icon" />
                    <em>{{ item.title }}</em>
                  </el-link>
                </div>
              </div>
            </el-col>
            <el-col v-if="moduleList(modules.list3).length > 0" :span="12" class="channel channel-box3">
              <div class="flex inner">
                <label class="tit">财务部门</label>
                <div class="channelLink">
                  <el-link
                    v-for="(item, idx) in moduleList(modules.list3)"
                    :key="idx"
                    :underline="false"
                    class="link"
                    @click="$router.push(item.path)"
                  >
                    <i class="iconfont" :class="item.icon" />
                    <em>{{ item.title }}</em>
                  </el-link>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="home-bottom">
          <el-row :gutter="15">
            <el-col :span="7" class="conLeft">
              <div class="inner">
                <h2>
                  <span>公告</span>
                  <em class="c-link" @click="viewMore">更多</em>
                </h2>
                <ul v-if="announceList.length > 0" class="mt10">
                  <li v-for="(item, index) in announceLimitList" :key="index" :title="item.title">
                    <span @click="view(item.id)">{{ item.title }}</span>
                  </li>
                </ul>
                <div v-else class="tc" style="padding-top: 50px; font-size: 18px">
                  <el-empty description="暂无数据" />
                </div>
              </div>
            </el-col>
            <el-col id="chartBox" :span="17" class="conRight">
              <div class="inner">
                <h2 class="clearfix">
                  <span class="fl">计划分解</span>
                  <div v-show="isAdmin" class="fl ml20">
                    <el-select
                      v-model="deptId"
                      :clearable="false"
                      filterable
                      class="w100off"
                      placeholder="请选择"
                      size="small"
                      @change="deptIdChange"
                    >
                      <el-option
                        v-for="(item, index) in deptIdOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </div>
                </h2>
                <!--                <div v-if="!isEmptyChart">
                  <div v-if="isShowChartLeft" class="fl" style="width: 50%;">
                    <chart-left ref="chartLeft" :dept-id="deptId" :is-admin="isAdmin" :budget-year="budgetYear" />
                  </div>
                  <div v-if="isShowChartRight" class="fl" style="width: 50%;">
                    <chart-right ref="chartRight" :dept-id="deptId" :is-admin="isAdmin" :budget-year="budgetYear" />
                  </div>
                </div>-->
                <div class="tc" style="padding-top: 50px; font-size: 18px">
                  <el-empty description="暂无数据" />
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </d2-container>
    <AnnounceView ref="announceViewRef" />
  </div>
</template>
<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
}
</script>
<script setup>
import AnnounceView from '@/views/sys/announce/announceView.vue'

const store = useStore()
const router = useRouter()

const announceViewRef = ref(null)
const isAdmin = ref(false)
/* const budgetYear = ref('');*/
const deptId = ref('')
const deptIdOptions = ref([])
const chartLoading = ref(false)
/* const isEmptyChart = ref(false);
const isShowChartLeft = ref(false);
const isShowChartRight = ref(false);*/
const announceList = ref([])
const menuMap = ref(_.keyBy($utils.treeUtils.flatten(store.menu.addRoutes, 'children'), 'name'))

const modules = reactive({
  list1: ['User', 'Menu', 'Role', 'Corp', 'Dept', 'Announce', 'Code'],
  list2: ['FrequentProjectExp', 'ProjectExp', 'UnpaidFunds', 'DeptBudgetStatistics', 'ProjectPlan', 'IncomePropose'],
  list3: ['BudgetReview', 'BudgetSummary', 'ProjectApproval', 'IncomeApproval'],
})

const moduleList = computed(() => {
  return (list) => {
    return _.chain(list)
      .filter((name) => !_.isUndefined(menuMap.value[name]))
      .map((name) => {
        return {
          path: menuMap.value[name].path,
          title: menuMap.value[name].meta.title,
          icon: `icon-${menuMap.value[name].meta.icon}`,
        }
      })
      .value()
  }
})

const announceLimitList = computed(() => {
  return announceList.value.slice(0, 8)
})

onMounted(async () => {
  chartLoading.value = true
  const roleTypes = store.user.userInfo.roleTypes
  if (roleTypes.includes(Code.ROLE_TYPE._01)) {
    isAdmin.value = true
    deptIdOptions.value = []
    const deptIdOne = [{ id: '', name: '全部' }]
    deptIdOptions.value = [...deptIdOne, ...(await $api.sys.deptApi.findDeptSelectList())]
  } else {
    isAdmin.value = false
  }
  announceList.value = await $api.sys.announceApi.getPublicAnnounceList()
  deptId.value = ''
})

function deptIdChange(val) {
  deptId.value = val
  /* this.loadData(val);*/
}
function view(id) {
  announceViewRef.value.open(id)
}
async function viewMore() {
  await router.push({ path: '/sys/announce?isView=true' })
}
</script>
<!--suppress CssUnknownTarget -->
<style rel="stylesheet/scss" lang="scss" scoped>
.home-container-box {
  :deep(.d2-container-full__body) {
    background: #e8e9ee !important;
  }
}
/***********   */
.home-top {
  overflow: hidden;
  padding: 5px 5px 0;
  .flex {
    display: inherit;
  }
  .channel {
    position: relative;
    margin-bottom: 10px;
    color: #fff;
    //width: calc(50% - 5px);
    .inner {
      border-radius: 5px;
      height: 88px;
    }
    &::after {
      position: absolute;
      right: 0;
      top: 0;
      width: 186px;
      height: 88px;
      background-repeat: no-repeat;
      background-position: center right;
      content: '';
    }
    &:nth-of-type(1) {
      .inner {
        background: linear-gradient(270deg, #f7954c 0%, #ee7e4e 100%);
      }
      &::after {
        background-image: url('@/assets/img/home/jcxx-bg.png');
      }
      .link {
        background: rgba(229, 108, 55, 1);
      }
    }
    &:nth-of-type(2) {
      .inner {
        background: linear-gradient(90deg, #4d93e4 0%, #71adf2 100%);
      }
      &::after {
        background-image: url('@/assets/img/home/jhfj-bg.png');
      }
      .link {
        background: rgba(41, 122, 216, 1);
      }
    }
    &:nth-of-type(3) {
      .inner {
        background: linear-gradient(90deg, #e6bb21 0%, #f3d270 100%);
      }
      &::after {
        background-image: url('@/assets/img/home/cwbu-bg.png');
      }
      .link {
        background: rgba(206, 165, 23, 1);
      }
    }
    &:nth-of-type(4) {
      .inner {
        background: linear-gradient(270deg, #a6dc75 0%, #82ca40 100%);
      }
      &::after {
        background-image: url('~@/assets/img/home/ysbg-bg.png');
      }
      .link {
        background: rgba(95, 171, 26, 1);
      }
    }
    .tit {
      float: left;
      position: relative;
      z-index: 2;
      padding-left: 10px;
      line-height: 88px;
      font-weight: bold;
      font-size: 16px;
    }
    .channelLink {
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 2;
      box-sizing: border-box;
      padding-left: 120px;
      width: 100%;
      transform: translate(-50%, -50%);
      .link {
        display: inline-block;
        position: relative;
        z-index: 2;
        margin: 5px 18px 5px 0;
        padding: 0 10px;
        border: 1px solid #fff;
        border-radius: 4px;
        min-width: 90px;
        height: 30px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        transition: all 0.5s;
        .iconfont {
          display: inline-block;
          margin-right: 5px;
          vertical-align: top;
        }
        em {
          display: inline-block;
          vertical-align: top;
          font-weight: bold;
        }
        &:hover {
          border-radius: 15px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
  .icon-BudgetOrg::before {
    content: '\e65b';
  }
  .icon-BudgetTeacher::before {
    content: '\e61a';
  }
  .icon-BudgetStudent::before {
    content: '\e7c0';
  }
  .icon-AcademicAffairs::before {
    content: '\e68d';
  }
  .icon-BudgetFinance::before {
    content: '\e67d';
  }
  .icon-PublicExp::before {
    content: '\e667';
  }
  .icon-FrequentProjectExp::before {
    content: '\e634';
  }
  .icon-ProjectExp::before {
    content: '\e911';
  }
  .icon-DeptBudgetStatistics::before {
    content: '\e635';
  }
  .icon-BudgetReview::before {
    content: '\e64f';
  }
  .icon-BudgetSummary::before {
    content: '\e7fe';
  }
  .icon-cgjhb::before {
    content: '\e67c';
  }
  .icon-zjjhb::before {
    content: '\e665';
  }
  .icon-xzzcb::before {
    content: '\e67e';
  }
  .icon-UnpaidFunds::before {
    content: '\e666';
  }
  .icon-ProjectPlan::before {
    content: '\e617';
  }
  .icon-IncomePropose::before {
    content: '\e654';
  }
  .icon-ProjectApproval::before {
    content: '\e64e';
  }
  .icon-IncomeApproval::before {
    content: '\e652';
  }
}
.home-bottom {
  overflow: hidden;
  margin: 5px;
  h2 {
    position: relative;
    margin: 0 -20px;
    padding: 0 20px 10px 30px;
    border-bottom: 1px solid #dfe4ed;
    line-height: 28px;
    font-weight: 400;
    font-size: 18px;
    color: #444;
    &::before {
      display: inline-block;
      position: absolute;
      left: 20px;
      top: 50%;
      margin-right: 6px;
      margin-top: -12px;
      border-radius: 2px;
      width: 4px;
      height: 14px;
      background: #3b85c9;
      content: '';
    }
    .c-link {
      float: right;
      cursor: pointer;
      font-size: 14px;
      color: #3b85c9;
    }
  }
  .conLeft,
  .conRight {
    .inner {
      padding: 10px 20px 20px;
      height: 450px;
      background: #fff;
    }
  }
  .conLeft {
    li {
      position: relative;
      margin-bottom: 5px;
      padding-left: 15px;
      border-bottom: 1px solid #dfe4ed;
      height: 40px;
      cursor: pointer;
      line-height: 40px;
      font-size: 14px;
      color: #333;
      transition: all 0.3s;
      &::after {
        position: absolute;
        left: 0;
        bottom: -1px;
        width: 0;
        height: 1px;
        background: #5da5e8;
        content: '';
        transition: all 0.3s;
      }
      &::before {
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -3px;
        border-radius: 50%;
        width: 6px;
        height: 6px;
        background: #5da5e8;
        content: '';
        transition: all 0.3s;
      }
      span {
        display: block;
        overflow: hidden;
        position: relative;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;
      }
      &:hover {
        &::after {
          width: 100%;
        }
      }
    }
  }
}
@media screen and (max-width: 1366px) {
  html {
    font-size: 52.5%;
  }
}
@media screen and (max-width: 1280px) {
  html {
    font-size: 42.5%;
  }
}
</style>
