<template>
  <div>
    <d2-container>
      <div class="app-container">
        <table-comb
          ref="tableRef"
          :name="title"
          :get-action="apiUtils.getPage"
          action-url="/sys/code/getCodeGroupPage.json"
          :remove-action="$api.sys.codeApi.deleteByTypeCode"
          remove-action-url="/sys/code/deleteByTypeCode.json"
          disabled-remote-condition-query
          :format-data="formatData"
          :show-search-form="true"
          :show-controls="true"
          :show-default-controls-right="true"
          :auto-fetch="true"
          :show-pagination="false"
          :exists-advanced-search="false"
        >
          <!--基础查询-->
          <template #baseSearchForm="props">
            <el-col :span="6">
              <el-form-item label="分类代码:" label-width="80px">
                <el-input v-model="props.form.typeCode" size="small" clearable placeholder="请输入分类代码" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="分类名称:" label-width="80px">
                <el-input v-model="props.form.typeName" clearable placeholder="请输入分类代码" />
              </el-form-item>
            </el-col>
          </template>
          <!--控制按钮-->
          <template #controlsLeft>
            <el-button class="vt" size="small" type="success" icon="plus" @click="add">新增</el-button>
            <el-button class="vt" size="small" type="danger" @click="generateCode">重新生成码表</el-button>
            <el-button class="vt" size="small" type="warning" @click="reloadCodeCache">更新缓存</el-button>
          </template>
          <!--表格-->
          <template #tableColumns>
            <el-table-column label="操作" fixed="left" width="200px" align="center">
              <template #default="scope">
                <div>
                  <el-button type="primary" text size="small" @click="edit(scope.row)">
                    {{ scope.row['isEnum'] === TRUE ? '查看' : '编辑' }}
                  </el-button>
                  <el-button type="danger" text size="small" @click="remove(scope.row.typeCode)">删除</el-button>
                  <ButtonEnumPackage
                    v-if="scope.row['isEnum'] === TRUE"
                    ref="buttonEnumPackageRef"
                    :type-code="scope.row.typeCode"
                  />
                  <el-button
                    v-if="scope.row['isEnum'] === FALSE && scope.row['isDynamicConfig'] !== TRUE"
                    type="primary"
                    text
                    size="small"
                    @click="showGenerateEnumDialog(scope.row)"
                  >
                    生成枚举
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="分类代码">
              <template #default="scope">
                {{ scope.row.typeCode }}
              </template>
            </el-table-column>
            <el-table-column label="分类名称">
              <template #default="scope">
                {{ scope.row.typeName }}
              </template>
            </el-table-column>
            <el-table-column label="创建日期" width="160" align="center">
              <template #default="scope">
                {{ $filters.dateFormat(scope.row['createTs'], 'YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column label="修改日期" width="160" align="center">
              <template #default="scope">
                {{ $filters.dateFormat(scope.row['updateTs'], 'YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column label="类型" align="center" width="100">
              <template #default="scope">
                <el-tag effect="plain" :type="scope.row.codeCategory?.type">{{ scope.row.codeCategory?.name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="变更状态" align="center" width="120">
              <template #default="scope">
                <el-tag
                  v-if="isModifyStatusButton(scope.row['modifyStatus'])"
                  :type="getModifyStatusColor(scope.row['modifyStatus'])"
                  style="cursor: pointer"
                  class="mr5"
                  effect="light"
                  @click="onModifyStatusClick(scope.row)"
                >
                  {{ $filters.codeFormat(scope.row['modifyStatus'], 'CODE_MODIFY_STATUS') }}
                </el-tag>
                <el-tag
                  v-else-if="
                    !isModifyStatusButton(scope.row['modifyStatus']) && isCodeStatusButton(scope.row.codeStatus)
                  "
                  effect="plain"
                  :type="scope.row.codeStatus.type"
                  style="cursor: pointer"
                  @click="onModifyStatusClick(scope.row)"
                >
                  {{ scope.row.codeStatus.name }}
                </el-tag>
                <span
                  v-else
                  :style="{ color: getModifyStatusColor(scope.row['modifyStatus']) }"
                  @click="onModifyStatusClick(scope.row)"
                >
                  {{ $filters.codeFormat(scope.row['modifyStatus'], 'CODE_MODIFY_STATUS') }}
                </span>
              </template>
            </el-table-column>
          </template>
        </table-comb>
      </div>
    </d2-container>
    <CodeForm ref="formRef" @save-success="onSaveSuccess" />
    <CompareForm ref="compareFormRef" @save-success="onSaveSuccess" />
    <GenerateEnumDialog ref="generateEnumDialogRef" />
  </div>
</template>
<script lang="ts">
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Code',
}
</script>
<script setup lang="ts">
import codeJson from '@/common/code.json'

import ButtonEnumPackage from './buttonEnumPackage.vue'
import CodeForm from './codeForm.vue'
import CompareForm from './compareForm.vue'
import GenerateEnumDialog from './generateEnumDialog.vue'

const store = useStore()

const { tableRef, formRef, title, add, remove, onSaveSuccess } = useBasePage()

const compareFormRef = ref(null)
const generateEnumDialogRef = ref(null)

const codeCategory = {
  CODE: {
    index: 1,
    name: '码表',
    type: 'info',
  },
  ENUM: {
    index: 0,
    name: '枚举',
    type: '',
  },
  SYS_PARAM: {
    index: 2,
    name: '系统参数',
    type: 'danger',
  },
}

const codeStatus = {
  ADD: {
    index: 1,
    name: '码表新增',
    type: 'success',
  },
  EDIT: {
    index: 2,
    name: '码表修改',
    type: 'warning',
  },
  NOT_EXISTS: {
    index: 0,
    name: '码表缺失',
    type: 'danger',
  },
}

const condition = computed(() => tableRef.value.searchModel)

async function edit(rowData) {
  await formRef.value.open(rowData)
}

function setCodeCategory(rowData) {
  if (rowData.isDynamicConfig === TRUE) {
    rowData.codeCategory = codeCategory.SYS_PARAM
  } else if (rowData.isEnum === TRUE) {
    rowData.codeCategory = codeCategory.ENUM
  } else {
    rowData.codeCategory = codeCategory.CODE
  }
}
function reassignTableData(tableData) {
  _.each(tableData, (row) => {
    setCodeCategory(row)

    if (row.isDynamicConfig) {
      return
    }
    if (!codeJson[row.typeCode]) {
      row.codeStatus = codeStatus.ADD
      return
    }
    const localCodeList = codeJson[row.typeCode].list
    const remoteCodeList = row.codeList
    if (!remoteCodeList) {
      row.codeStatus = codeStatus.NOT_EXISTS
      return
    }
    if (localCodeList.length !== remoteCodeList.length) {
      row.codeStatus = codeStatus.EDIT
      return
    }
    const diffItem = _.find(localCodeList, (localItem, idx) => {
      const remoteItem = remoteCodeList[idx]
      return (
        localItem.configCode !== remoteItem.configCode ||
        localItem.configName !== remoteItem.configName ||
        localItem.remark !== (remoteItem.remark || '')
      )
    })
    if (diffItem) {
      row.codeStatus = codeStatus.EDIT
    }
  })
}
function filterTableData(tableData) {
  return _.filter(
    tableData,
    (rowData) =>
      _.includes(rowData.typeCode, condition.value.typeCode || '') &&
      _.includes(rowData.typeName, condition.value.typeName || ''),
  )
}
/**
 * 格式
 * */
function formatData(tableData) {
  reassignTableData(tableData)
  const notExistTypeCodes = _.difference(_.keys(codeJson), _.map(tableData, 'typeCode'))
  const newCodeList = _.map(notExistTypeCodes, (typeCode) => {
    return {
      codeStatus: codeStatus.NOT_EXISTS,
      typeCode,
      typeName: codeJson[typeCode].typeName,
    }
  })
  /* console.log('newCodeList', JSON.parse(JSON.stringify(newCodeList)));*/
  tableData = [...tableData, ...newCodeList]
  tableData = filterTableData(tableData)
  tableData = _.orderBy(tableData, ['codeStatus.index', 'modifyStatus', 'codeCategory.index'], ['asc', 'asc', 'asc'])
  return tableData
}
/**
 * 生成码表
 * */
async function generateCode() {
  const res = await $api.sys.codeApi.generateCode()
  await $utils.messageUtils.showResponseMessage(res)
  tableRef.value.fetchData()
}

/**
 * 是否显示变更状态操作按钮
 * */
function isModifyStatusButton(modifyStatus) {
  return _.includes([Code.CODE_MODIFY_STATUS._1, Code.CODE_MODIFY_STATUS._2], modifyStatus)
}
/**
 * 是否显示变更状态操作按钮
 * */
function isCodeStatusButton(status) {
  if (!status) {
    return false
  }
  return _.some([codeStatus.NOT_EXISTS, codeStatus.ADD, codeStatus.EDIT], status)
}
/**
 * 获取变更状态字体颜色
 * */
function getModifyStatusColor(modifyStatus) {
  return (_.find(store.code.lists['CODE_MODIFY_STATUS'], { value: modifyStatus }) || {}).remark
}
/**
 * 变更状态点击
 * */
async function onModifyStatusClick(rowData) {
  if (_.includes([Code.CODE_MODIFY_STATUS._1, Code.CODE_MODIFY_STATUS._2], rowData.modifyStatus)) {
    await compareFormRef.value.open(rowData.typeCode, rowData.typeName, Constants.codeCompareFlag.ENUM_VS_CODE)
  } else if (
    _.includes(_.map([codeStatus.ADD, codeStatus.EDIT, codeStatus.NOT_EXISTS], 'index'), rowData.codeStatus.index)
  ) {
    await compareFormRef.value.open(rowData.typeCode, rowData.typeName, Constants.codeCompareFlag.LOCAL_VS_REMOTE)
  }
}
/**
 * 打开生成枚举对话框
 * */
function showGenerateEnumDialog(rowData) {
  generateEnumDialogRef.value.show(rowData.typeCode, rowData.typeName)
}
/**
 * 更新缓存
 * */
async function reloadCodeCache() {
  const res = await $api.sys.codeApi.reloadCodeCache()
  await $utils.messageUtils.showResponseMessage(res).catch((e) => {
    throw e
  })
}
</script>
