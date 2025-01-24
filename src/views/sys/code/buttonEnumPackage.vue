<template>
  <el-button ref="buttonRef" type="primary" text size="small">
    枚举包名
    <el-popover
      ref="popoverRef"
      :virtual-ref="buttonRef"
      trigger="click"
      virtual-triggering
      placement="right"
      width="500"
      @show="show"
    >
      <div class="content">
        <p>
          <label class="lab-left">枚举类名：</label>
          <label class="lab-right">{{ enumName }}</label>
        </p>
        <p>
          <label class="lab-left">枚举路径：</label>
          <label class="lab-right"><input ref="packagePathRef" v-model="packagePath" type="text" readonly /></label>
        </p>
      </div>
      <el-link type="primary" @click="copyEnumPackage">复制路径</el-link>
    </el-popover>
  </el-button>
</template>

<script setup lang="ts">
const props = defineProps({
  typeCode: {
    type: String,
    default: '',
  },
})

const { typeCode } = toRefs(props)

const buttonRef = ref(null)
const packagePathRef = ref(null)
const packagePath = ref(null)
const enumName = ref(null)

async function show() {
  const res = await $api.sys.codeApi.getEnumPackageName(typeCode.value)
  const fullPath = res.info
  enumName.value = fullPath.substring(fullPath.lastIndexOf('.') + 1)
  packagePath.value = fullPath.substring(0, fullPath.lastIndexOf('.'))
}

function copyEnumPackage() {
  packagePathRef.value.select()
  // noinspection JSDeprecatedSymbols
  document.execCommand('copy')
  $utils.messageUtils.message.success('复制路径成功')
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  line-height: 30px;
  font-size: 16px;
  .lab-left {
    /* width: 50px; */
  }
  .lab-right {
    padding-left: 10px;
    input[type='text'] {
      border: 0;
      width: 380px;
    }
    input[type='text']:focus {
      outline: none;
    }
  }
  :deep(.el-link) {
    margin-top: 10px;
    font-size: 16px;
  }
}
</style>
