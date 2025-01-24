<template>
  <FormWrapper ref="formWrapper" :title="title" @after-back="afterBack">
    <template #container>
      <div class="form-box">
        <el-form
          ref="formRef"
          :model="model"
          :rules="rules"
          label-width="120px"
          label-position="right"
          style="padding: 30px"
        >
          <el-row style="height: 50px">
            <el-col :span="12">
              <editable-item
                :editable="editable"
                :model="model"
                label="分类代码"
                prop="typeCode"
                :rules="baseFormRules.input"
              >
                <template #default="{ prop }">
                  <el-input v-model="model[prop]" minlength="1" placeholder="请填写" />
                </template>
              </editable-item>
            </el-col>
            <el-col :span="12">
              <editable-item
                :editable="editable"
                :model="model"
                label="分类名称"
                prop="typeName"
                :rules="baseFormRules.input"
              >
                <template #default="{ prop }">
                  <el-input v-model="model[prop]" minlength="1" placeholder="请填写" />
                </template>
              </editable-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label-width="30px" prop="codeList">
                <edit-table
                  ref="codeTableRef"
                  v-model:data="model.codeList"
                  :form-ref="formRef"
                  :default-row-data="defaultRowData"
                  :editable="editable"
                  @after-add="afterAdd"
                >
                  <template #tableColumns="{ getRowIndex }">
                    <el-table-column label="码表编码" prop="configCode" width="200" align="center">
                      <template #default="scope">
                        <editable-cell
                          v-model="scope.row[scope.column.property]"
                          show-input
                          :prop="`codeList.${getRowIndex(scope.row)}.${scope.column.property}`"
                          :rules="baseFormRules.input"
                          size="small"
                          minlength="1"
                          maxlength="100"
                          :editable="editable"
                        >
                          <template #content>
                            <span>{{ scope.row[scope.column.property] }}</span>
                          </template>
                        </editable-cell>
                      </template>
                    </el-table-column>
                    <el-table-column label="码表值" prop="configName" width="300px" align="center">
                      <template #default="scope">
                        <editable-cell
                          v-model="scope.row[scope.column.property]"
                          show-input
                          :prop="`codeList.${getRowIndex(scope.row)}.${scope.column.property}`"
                          :rules="baseFormRules.input"
                          size="small"
                          minlength="1"
                          maxlength="100"
                          :editable="editable"
                        >
                          <template #content>
                            <span>{{ scope.row[scope.column.property] }}</span>
                          </template>
                        </editable-cell>
                      </template>
                    </el-table-column>
                    <el-table-column header-align="center" label="描述" prop="remark" show-overflow-tooltip>
                      <template #default="scope">
                        <editable-cell
                          v-model="scope.row[scope.column.property]"
                          show-input
                          :prop="`codeList.${getRowIndex(scope.row)}.${scope.column.property}`"
                          size="small"
                          minlength="1"
                          maxlength="200"
                          :editable="editable"
                          show-word-limit
                          type="textarea"
                        >
                          <template #content>
                            <span>{{ scope.row[scope.column.property] }}</span>
                          </template>
                        </editable-cell>
                      </template>
                    </el-table-column>
                    <el-table-column prop="isDefault" label="默认" width="80" align="center">
                      <template #default="scope">
                        <editable-cell
                          v-model="scope.row[scope.column.property]"
                          editable-component="el-switch"
                          :active-value="TRUE"
                          :inactive-value="FALSE"
                          show-input
                          :prop="`codeList.${getRowIndex(scope.row)}.${scope.column.property}`"
                          :rules="rules[scope.column.property]"
                          :editable="editable"
                        >
                          <template #content>
                            {{ $filters.codeFormat(scope.row[scope.column.property], 'YES_NO') }}
                          </template>
                        </editable-cell>
                      </template>
                    </el-table-column>
                    <el-table-column prop="indexNo" label="排序" width="80" align="center">
                      <template #default="scope">
                        <editable-cell
                          v-model="scope.row[scope.column.property]"
                          show-input
                          :prop="`codeList.${getRowIndex(scope.row)}.${scope.column.property}`"
                          :rules="baseFormRules.input"
                          size="small"
                          minlength="1"
                          maxlength="100"
                          :editable="editable"
                        >
                          <template #content>
                            <span>{{ scope.row[scope.column.property] }}</span>
                          </template>
                        </editable-cell>
                      </template>
                    </el-table-column>
                    <el-table-column prop="createTs" label="创建日期" width="100px" align="center">
                      <template #default="scope">
                        {{ $filters.dateFormat(scope.row.createTs, 'YYYY-MM-DD HH:mm:ss') }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="updateTs" label="修改日期" width="100px" align="center">
                      <template #default="scope">
                        {{ $filters.dateFormat(scope.row.updateTs, 'YYYY-MM-DD HH:mm:ss') }}
                      </template>
                    </el-table-column>
                  </template>
                </edit-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </template>
    <template #footer>
      <el-button v-show="editable" type="primary" @click="save">保存</el-button>
      <el-button @click="back()">关闭</el-button>
    </template>
  </FormWrapper>
</template>
<script setup>
import codeJson from '@/common/code.json'
import { baseEmits } from '@/hooks/useBaseForm'

const emit = defineEmits(baseEmits)

const defaultFormData = {
  typeCode: '',
  typeName: '',
  codeList: [],
  deleteCodeList: [],
}

const defaultRowData = {
  configCode: '',
  configName: '',
  remark: '',
  isDefault: FALSE,
  indexNo: '',
}

const options = {
  defaultFormData,
  getAction: $api.sys.userApi.getUserById,
  saveAction: $api.sys.codeApi.saveCodeList,
  getSaveData() {
    return _.map(model.codeList, (item) => {
      return Object.assign(item, {
        typeCode: model.typeCode,
        typeName: model.typeName,
      })
    })
  },
}

// noinspection JSUnusedGlobalSymbols
const { formWrapper, formRef, model, title, save, back, afterBack } = useBaseForm(options, emit)

const { baseFormRules } = useValidator(formRef, model)

const codeTableRef = ref(null)
const editable = ref(false)

const codeListValidator = (rule, value, callback) => {
  if (value.length === 0) {
    return callback(new Error('列表不能为空'))
  }
  callback()
}

const rules = reactive({
  codeList: [{ validator: codeListValidator, trigger: 'blur' }],
})

async function open({ typeCode, isEnum = FALSE } = {}) {
  const formFlag = !_.isEmpty(typeCode) ? Constants.formFlag.EDIT : Constants.formFlag.ADD
  editable.value = isEnum === FALSE
  formWrapper.value.formFlag = formFlag
  formWrapper.value.open()
  if (formFlag === Constants.formFlag.EDIT) {
    model.codeList = _.map(await $api.sys.codeApi.findCodeList(typeCode), (item) => {
      return Object.assign(item, { rowState: Constants.rowState.UNCHANGED })
    })
    model.typeCode = typeCode
    if (model.codeList.length > 0) {
      model.typeName = model.codeList[0].typeName
    } else {
      model.codeList = _.map(codeJson[typeCode].list, (item, idx) => {
        return {
          ...item,
          indexNo: idx + 1,
          rowState: Constants.rowState.ADDED,
        }
      })
      model.typeName = codeJson[typeCode].typeName
    }
  }
}

function afterAdd(rowData) {
  rowData.indexNo = (_(codeTableRef.value.dataExcludeDelete).map('indexNo').max() || 0) + 1
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.form-box {
  :deep(.el-table) {
    th {
      padding: 5px 0;
    }
  }
  :deep(.el-form) {
    .el-table td {
      padding: 5px 0;
    }
  }
  :deep(.cell) {
    .el-form-item__content {
      line-height: 28px;
    }
  }
}
</style>
