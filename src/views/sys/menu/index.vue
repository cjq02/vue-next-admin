<template>
  <div>
    <d2-container>
      <div class="app-container">
        <table-comb
          ref="tableRef"
          :name="title"
          :get-action="apiUtils.getPage"
          action-url="/sys/menu/getMenuPage.json"
          :remove-action="apiUtils.remove"
          remove-action-url="/sys/menu/deleteMenu.json"
          :show-search-form="false"
          :show-controls="true"
          :show-default-controls-right="true"
          :auto-fetch="true"
          :format-data="formatData"
          row-key="id"
          :show-pagination="false"
        >
          <!--控制按钮-->
          <template #controlsLeft>
            <el-button type="success" size="small" icon="plus" @click="add">新增</el-button>
            <el-button type="primary" size="small" icon="search" @click="fetchData">查询</el-button>
          </template>
          <!--表格-->
          <template #tableColumns>
            <el-table-column label="名称" min-width="300">
              <template #default="scope">
                <el-button type="primary" text @click="edit(scope.row.id)">{{ scope.row.name }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template #default="scope">
                <el-button type="primary" size="small" text @click="edit(scope.row.id)">编辑</el-button>
                <el-button type="primary" size="small" text @click="copy(scope.row.id)">复制</el-button>
                <el-button type="danger" size="small" text @click="remove(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column label="权限前缀码" align="center" width="250">
              <template #default="scope">
                <span>{{ scope.row.permissionPrefixCode }}</span>
              </template>
            </el-table-column>
            <el-table-column label="URL" header-align="center" min-width="250">
              <template #default="scope">
                <span>{{ scope.row.url }}</span>
              </template>
            </el-table-column>
            <el-table-column label="顺序" width="150" align="center">
              <template #default="scope">
                <span>{{ scope.row.priority }}</span>
              </template>
            </el-table-column>
          </template>
        </table-comb>
      </div>
    </d2-container>
    <MenuForm ref="formRef" @save-success="onSaveSuccess" />
  </div>
</template>
<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Menu',
}
</script>
<script setup>
import { getCurrentInstance } from 'vue'

import { useBasePage } from '@/hooks/useBasePage'

import MenuForm from './menuForm.vue'

const { proxy } = getCurrentInstance()

const { formRef, tableRef, title, add, edit, remove, fetchData, onSaveSuccess } = useBasePage()

function formatData(list) {
  return proxy.$utils.treeUtils.listToTree(list, { parentId: 'parentId' })
}

function copy(id) {
  formRef.value.openByCopy(id)
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
