<template>
  <div>
    <d2-container>
      <div class="app-container">
        <table-comb
          ref="tableRef"
          :name="title"
          :get-action="apiUtils.getPage"
          action-url="/sys/dept/getPage.json"
          :remove-action="apiUtils.remove"
          remove-action-url="/sys/dept/deleteDepartmentById.json"
          :base-search-model="condition"
          :format-data="formatData"
          :show-search-form="true"
          :show-controls="true"
          :show-default-controls-right="true"
          :auto-fetch="true"
          :exists-advanced-search="false"
        >
          <!--基础查询-->
          <template #baseSearchForm="props">
            <el-col v-if="checkRole([Code.ROLE_TYPE._01])" :span="8">
              <el-form-item label="企业名称:">
                <el-tree-select
                  v-model="props.form.corpId"
                  :data="corpTreeOptions"
                  placeholder="请选择"
                  clearable
                  :check-strictly="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部门名称:">
                <el-input v-model="props.form.name" size="small" clearable placeholder="请输入部门名称" />
              </el-form-item>
            </el-col>
          </template>
          <!--控制按钮-->
          <template #controlsLeft>
            <el-button type="success" size="small" icon="plus" @click="add">新增</el-button>
            <el-button type="primary" size="small" icon="edit" :disabled="saveListDisabled" @click="saveList">
              批量保存
            </el-button>
          </template>
          <!--表格-->
          <template #tableColumns>
            <el-table-column label="操作" align="center" width="200">
              <template #default="scope">
                <el-button
                  v-show="!scope.row.editMode"
                  v-permission="[Constants.PERMISSION.EDIT]"
                  type="primary"
                  text
                  size="small"
                  @click="edit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-show="!scope.row.editMode"
                  v-permission="[Constants.PERMISSION.DEL]"
                  type="danger"
                  text
                  size="small"
                  @click="remove(scope.row)"
                >
                  删除
                </el-button>
                <el-button
                  v-show="scope.row.editMode"
                  v-permission="[Constants.PERMISSION.EDIT]"
                  type="primary"
                  text
                  size="small"
                  @click="save(scope.row)"
                >
                  保存
                </el-button>
                <el-button
                  v-show="scope.row.editMode"
                  v-permission="[Constants.PERMISSION.EDIT]"
                  type="primary"
                  text
                  size="small"
                  @click="cancel(scope.row)"
                >
                  取消
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              v-if="checkRole([Code.ROLE_TYPE._01])"
              label="企业名称"
              prop="corpId"
              header-align="center"
              min-width="300"
            >
              <template #default="scope">
                <editable-cell
                  v-model="scope.row[scope.column.property]"
                  editable-component="el-tree-select"
                  :show-input="scope.row.editMode"
                  :prop="`tableData.${scope.$index}.${scope.column.property}`"
                  :rules="rules[scope.column.property]"
                  :data="corpTreeOptions"
                  check-strictly
                  placeholder="请选择"
                  tool-tip-content=""
                  minlength="1"
                  @cell-click="onCellClick(scope.row)"
                >
                  <template #content>
                    <span>{{ scope.row['corpName'] }}</span>
                  </template>
                </editable-cell>
              </template>
            </el-table-column>
            <el-table-column label="部门编码" prop="code" align="center" width="200">
              <template #default="scope">
                <editable-cell
                  v-model="scope.row[scope.column.property]"
                  :show-input="scope.row.editMode"
                  :prop="`tableData.${scope.$index}.${scope.column.property}`"
                  :rules="rules[scope.column.property]"
                  tool-tip-content=""
                  minlength="1"
                  @cell-click="onCellClick(scope.row)"
                >
                  <template #content>
                    <span>{{ scope.row[scope.column.property] }}</span>
                  </template>
                </editable-cell>
              </template>
            </el-table-column>
            <el-table-column label="部门名称" prop="name" header-align="center" min-width="300">
              <template #default="scope">
                <editable-cell
                  v-model="scope.row[scope.column.property]"
                  :show-input="scope.row.editMode"
                  :prop="`tableData.${scope.$index}.${scope.column.property}`"
                  :rules="rules[scope.column.property]"
                  tool-tip-content=""
                  minlength="1"
                  @cell-click="onCellClick(scope.row)"
                >
                  <template #content>
                    <span>{{ scope.row[scope.column.property] }}</span>
                  </template>
                </editable-cell>
              </template>
            </el-table-column>
          </template>
        </table-comb>
      </div>
    </d2-container>
  </div>
</template>

<script>
export default {
  name: 'Dept',
}
</script>
<script setup>
import { usePermission } from '@/hooks/usePermission'

const { checkRole } = usePermission()
const defaultRowData = {
  code: '',
  corpId: '',
  id: '',
  name: '',
  type: '',
}

const { tableRef, title, formatData, add, edit, save, saveList, saveListDisabled, remove, cancel, onCellClick } =
  useBaseEditPage({
    defaultRowData,
    saveAction: $api.sys.deptApi.saveDept,
    saveListAction: $api.sys.deptApi.saveDeptList,
  })

const corpTreeOptions = ref([])

const condition = reactive({
  name: '',
})

const rules = reactive({
  code: [{ message: '请输入', required: true, trigger: ['blur', 'change'] }],
  name: [{ message: '请输入', required: true, trigger: ['blur', 'change'] }],
  type: [{ message: '请选择', required: true, trigger: ['blur', 'change'] }],
})

onActivated(async () => {
  corpTreeOptions.value = await $api.sys.corpApi.getSelectTree()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.pagination {
  padding: 32px 16px;
  background: #fff;
}
</style>
