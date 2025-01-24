<template>
  <FormWrapper ref="formWrapper" title="公告详情">
    <template #container>
      <div id="file" class="view-panel">
        <div id="fileTableDiv" class="con-tab">
          <div id="fileDetail" class="con-scroll">
            <div class="file-form-top">
              <div class="tit">{{ model.title }}</div>
            </div>
            <div class="content" v-html="model.content.replaceAll('\n', '<br>')" />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <el-button v-if="checkRole([Code.ROLE_TYPE._01, Code.ROLE_TYPE._02])" size="danger" @click="revoke">
        退回
      </el-button>
      <el-button size="default" @click="back">关闭</el-button>
    </template>
  </FormWrapper>
</template>
<script setup>
const emit = defineEmits(['save-success'])
const formWrapper = ref(null)
const { checkRole } = usePermission()

const model = reactive({
  id: '',
  title: '',
  content: '',
  remark: '',
})

async function open(id) {
  formWrapper.value.open()
  Object.assign(model, await $api.sys.announceApi.getAnnounceById(id))
}

function back() {
  formWrapper.value.back()
}

async function revoke() {
  await $utils.messageUtils.confirm('确定退回吗？')
  const requestData = _.extend({}, model, { status: Code.ANNOUNCE_STATUS._0 })
  const res = await $api.sys.announceApi.saveAnnounce(requestData)
  await $utils.messageUtils.showResponseMessage(res)
  emit('save-success')
  back()
}

defineExpose({ open })
</script>
<style lang="scss" scoped>
.view-panel {
  margin: 0 auto;
  padding: 15px;
  max-width: 1200px;
  background-color: #fff;
  .con-tab {
    padding: 4px;
    /* background-color: #f5f5f5; */
    border-radius: 4px;
  }
  .title {
    font-weight: bold;
    font-size: 16px;
    color: #f00;
  }
  tr.file-tr {
    display: table-row;
    border-color: inherit;
    vertical-align: inherit;
  }
  td.file-td {
    display: table-cell;
    height: 26px;
    vertical-align: inherit;
    text-align: -webkit-center;
    font-size: 14px;
  }
  td.file-td-text {
    display: table-cell;
    vertical-align: inherit;
    font-size: 14px;
  }
  .form-grid > li {
    box-sizing: border-box;
    margin-top: 6px;
    margin-bottom: 6px;
  }
}
.file-form-top {
  margin: 0 auto;
  width: 50%;
  min-width: 800px;
  .tit {
    padding: 30px 20px 20px;
    line-height: 40px;
    text-align: center;
    font-size: 24px;
    color: #de0000;
  }
  .sketch {
    font-size: 15px;
    > li {
      float: left;
      padding: 10px;
      width: 60%;
      line-height: 30px;
      > label {
        display: inline-block;
        float: left;
        width: 100px;
      }
      > div {
        padding-left: 100px;
      }
      + li {
        width: 40%;
      }
      &.desc {
        width: 100%;
        > label {
          width: 60px;
          text-indent: 10px;
        }
        > div {
          padding-left: 60px;
        }
        .item {
          padding: 5px;
          line-height: 20px;
          transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
          transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
          &:hover {
            background-color: #f5f7fa;
          }
        }
      }
    }
  }
}
.content {
  margin: 10px 20px 0;
  padding: 30px 20px;
  border-top: 2px solid #a3a3a3;
  line-height: 30px;
}
</style>
