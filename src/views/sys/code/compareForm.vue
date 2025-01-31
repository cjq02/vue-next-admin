<template>
  <FormWrapper ref="formWrapperRef" title="码表对比">
    <template #container>
      <el-row class="inner-box">
        <el-col :span="6" class="p10">
          <editable-item :editable="false" :model="model" label="分类代码" prop="typeCode" class="mb0"></editable-item>
        </el-col>
        <el-col :span="6" class="p10">
          <editable-item :editable="false" :model="model" label="分类名称" prop="typeName" class="mb0"></editable-item>
        </el-col>
        <el-col :span="12"></el-col>
        <el-col :span="12">
          <h4 class="p10">{{ left.title }}</h4>
          <el-table ref="enumList" :data="left.list" style="width: 100%" class="p10" :row-class-name="getRowClassName">
            <el-table-column width="200" prop="code" label="编码" />
            <el-table-column width="300" prop="name" label="值" />
            <el-table-column prop="remark" label="备注" />
          </el-table>
        </el-col>
        <el-col :span="12">
          <h4 class="p10">{{ right.title }}</h4>
          <el-table ref="codeList" :data="right.list" style="width: 100%" class="p10" :row-class-name="getRowClassName">
            <el-table-column width="200" prop="code" label="编码" />
            <el-table-column width="300" prop="name" label="值" />
            <el-table-column prop="remark" label="备注" />
          </el-table>
        </el-col>
      </el-row>
    </template>
    <template #footer>
      <el-button v-show="btnSyncDataVisible" type="primary" @click="syncData()">同步到数据库</el-button>
      <el-button @click="$refs.formWrapper.back()">关闭</el-button>
    </template>
  </FormWrapper>
</template>

<script setup>
import codeJson from '@/common/code.json'

const color = {
  ADD: 'add-row',
  MODIFY: 'modify-row',
}

const formWrapper = ref(null)
const btnSyncDataVisible = ref(false)

const model = reactive({
  typeCode: '',
})

const left = reactive({
  list: [],
  title: '',
})
const right = reactive({
  list: [],
  title: '',
})

async function open(typeCode, typeName, compareFlag) {
  Object.assign(model, { typeCode, typeName })
  btnSyncDataVisible.value = compareFlag === Constants.codeCompareFlag.LOCAL_VS_REMOTE
  formWrapperRef.value.open()
  left.title = compareFlag.leftTitle
  right.title = compareFlag.rightTitle
  if (compareFlag === Constants.codeCompareFlag.ENUM_VS_CODE) {
    left.list = await getEnumList(typeCode)
    right.list = await getCodeList(typeCode)
  }
  if (compareFlag === Constants.codeCompareFlag.LOCAL_VS_REMOTE) {
    left.list = await getLocalCodeList(typeCode)
    right.list = await getCodeList(typeCode)
  }
  setRowColor()
}

function getEnumList(typeCode) {
  return $api.sys.codeApi.findEnumList(typeCode)
}

function getCodeList(typeCode) {
  return $api.sys.codeApi.findCodeList(typeCode)
}

function getLocalCodeList(typeCode) {
  if (!codeJson[typeCode]) {
    return []
  }
  return _.map(codeJson[typeCode].list, (item, index) => {
    return Object.assign(
      {
        code: item.configCode,
        indexNo: index + 1,
        name: item.configName,
        remark: item.remark,
        typeCode: typeCode,
        typeName: codeJson[typeCode].typeName,
      },
      item,
    )
  })
}

function setRowColor() {
  _.each(left.list, (row) => {
    row.clsName = getRowColor({ list: right.list, row })
  })
  _.each(right.list, (row) => {
    row.clsName = getRowColor({ list: left.list, row })
  })
}

function getRowColor({ row, list }) {
  let relRow = _.find(list, { code: row.code })
  if (relRow) {
    if (relRow.name !== row.name || (relRow.remark || '') !== (row.remark || '')) {
      return color.MODIFY
    }
    return ''
  }
  relRow = _.find(list, { name: row.name })
  if (relRow) {
    if (relRow.code !== row.code || (relRow.remark || '') !== (row.remark || '')) {
      return color.MODIFY
    }
    return ''
  }
  return color.ADD
}

function getRowClassName({ row }) {
  return row.clsName
}

async function syncData() {
  let list = _.clone(left.list)
  if (left.list.length < right.list.length) {
    const delList = _.map(right.list.slice(left.list.length), (item) =>
      Object.assign(item, { rowState: Constants.rowState.DELETED }),
    )
    list.push(...delList)
  }
  list = _.map(list, (item, index) => {
    item.id = (right.list[index] || {}).id
    if (_.isEmpty(item.id)) {
      item.rowState = Constants.rowState.ADDED
    }
    return item
  })
  const res = await $api.sys.codeApi.saveCodeList(list)
  await messageUtils.showResponseMessage(res).catch((e) => {
    throw e
  })
  formWrapperRef.value.back()
  emit('saveSuccess')
}

const emit = defineEmits(['saveSuccess'])
defineExpose({ open })
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.inner-box {
  :deep(.el-table) {
    .modify-row {
      background-color: #fdf5e6 !important;
    }
    .add-row {
      background-color: #f0f9eb !important;
    }
  }
}
</style>
