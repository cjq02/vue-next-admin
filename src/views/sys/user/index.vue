<template>
  <div>
    <d2-container>
      <div class="app-container">
        <table-comb
          ref="tableRef"
          :name="title"
          :base-search-model="condition"
          :get-action="apiUtils.getPage"
          action-url="/sys/user/getUserPage.json"
          :remove-action="apiUtils.remove"
          remove-action-url="/sys/user/deleteUser.json"
          :show-search-form="true"
          :show-controls="true"
          :show-default-controls-right="true"
          :auto-fetch="true"
          btn-search-float="fr"
        >
          <!--高级查询-->
          <template #baseSearchForm="props">
            <el-col :span="8">
              <el-form-item label="用户名:" label-width="80px">
                <el-input
                  v-model="props.form.userName"
                  size="small"
                  clearable
                  placeholder="请输入用户名/工号/姓名/手机号"
                />
              </el-form-item>
            </el-col>
          </template>
          <template #advancedSearchForm="props">
            <el-col :span="8">
              <el-form-item label="角色:" label-width="80px">
                <el-select
                  v-model="props.form.roleId"
                  placeholder="请选择"
                  filterable
                  clearable
                  auto-complete="off"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in roleOptions as any"
                    :key="item.value"
                    :label="item.label"
                    :disabled="item.disabled"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <!--控制按钮-->
          <template #controlsLeft>
            <el-button v-permission="[Constants.PERMISSION.EDIT]" type="success" size="small" icon="plus" @click="add">
              新增
            </el-button>
            <!--<el-button v-role="[Code.ROLE_TYPE._01]" type="info" plain size="small" icon="iconfont icon-download">-->
            <!--<a :href="require('@/assets/template/import/用户导入模板.xls')" download>下载模板</a>-->
            <!--</el-button>-->
            <!--<el-button v-role="[Code.ROLE_TYPE._01]" type="info" plain size="small" icon="iconfont icon-import" @click="openImportDialog">导入</el-button>-->
          </template>
          <!--表格-->
          <template #tableColumns>
            <el-table-column
              v-if="checkPermission([Constants.PERMISSION.EDIT, Constants.PERMISSION.DEL])"
              label="操作"
              fixed="left"
              width="150px"
              align="center"
            >
              <template #default="scope">
                <el-button
                  v-permission="[Constants.PERMISSION.EDIT]"
                  type="primary"
                  text
                  size="small"
                  @click="edit(scope.row.id)"
                >
                  编辑
                </el-button>
                <el-button
                  v-permission="[Constants.PERMISSION.DEL]"
                  type="danger"
                  text
                  size="small"
                  @click="remove(scope.row.id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="工号" width="150" sortable="custom" prop="jobNo" align="center">
              <template #default="scope">
                {{ scope.row[scope.column.property] }}
              </template>
            </el-table-column>
            <el-table-column label="姓名" width="150" sortable="custom" prop="realName" align="center">
              <template #default="scope">
                {{ scope.row[scope.column.property] }}
              </template>
            </el-table-column>
            <el-table-column label="联系电话" width="150" sortable="custom" prop="phone" align="center">
              <template #default="scope">
                {{ scope.row[scope.column.property] }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="checkRole([Code.ROLE_TYPE._01])"
              label="企业名称"
              min-width="200"
              sortable="custom"
              prop="corpName"
              header-align="center"
            >
              <template #default="scope">
                {{ scope.row.corpName }}
              </template>
            </el-table-column>
            <el-table-column label="部门名称" min-width="200" sortable="custom" prop="deptName" header-align="center">
              <template #default="scope">
                {{ scope.row.deptName }}
              </template>
            </el-table-column>
            <el-table-column label="角色" min-width="200" header-align="center">
              <template #default="scope">
                <el-tag
                  v-for="roleType in scope.row.roleName.split(',')"
                  :key="roleType"
                  class="mr5 mt5"
                  effect="light"
                  :type="roleType.includes('管理') ? 'danger' : 'primary'"
                >
                  {{ roleType }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="启用" width="70" align="center" prop="active">
              <template #default="scope">
                <el-tag effect="dark" :type="codeStore.keyMaps['IS_ACTIVE'][scope.row[scope.column.property]].type">
                  {{ codeStore.keyMaps['IS_ACTIVE'][scope.row[scope.column.property]].label }}
                </el-tag>
              </template>
            </el-table-column>
          </template>
        </table-comb>
      </div>
    </d2-container>
    <UserForm ref="formRef" @save-success="onSaveSuccess" />
    <!--    <import-dialog ref="importDialog" @importSuccess="importSuccess" />-->
  </div>
</template>
<script lang="ts">
export default {
  name: 'User',
}
</script>
<script lang="ts" setup>
import { usePermission } from '@/hooks/usePermission'

import UserForm from './userForm.vue'

const codeStore = useCodeStore()
const { checkRole, checkPermission } = usePermission()

const condition = reactive({
  corpId: '',
  departmentId: '',
  roleId: '',
  userName: '',
})

const { formRef, tableRef, title, add, edit, remove, onSaveSuccess } = useBasePage()

const roleOptions = ref([])
const corpTreeOptions = ref([])

async function loadSelectOptions() {
  await fetchRoleOptions()
  await fetchCorpTreeOptions()
}

const fetchRoleOptions = async (inputValue?) => (roleOptions.value = await roleApi.findRoleSelectList(inputValue))
// @ts-ignore
const fetchCorpTreeOptions = async () => (corpTreeOptions.value = await corpApi.getSelectTree())

onActivated(async () => {
  await loadSelectOptions()
})

provide('getRoleOptions', () => roleOptions.value)
provide('getCorpTreeOptions', () => corpTreeOptions.value)
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
