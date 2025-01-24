<template>
  <div>
    <d2-container>
      <div class="app-container">
        <table-comb
          ref="tableRef"
          :name="title"
          :base-search-model="condition"
          class="table-comb-tree"
          :get-action="apiUtils.getPage"
          action-url="/sys/corp/getCorpPage.json"
          :remove-action="apiUtils.remove"
          remove-action-url="/sys/corp/deleteCorp.json"
          :show-search-form="true"
          :show-controls="true"
          :show-default-controls-right="true"
          :auto-fetch="true"
          :format-data="formatData"
          row-key="id"
          :show-pagination="false"
          :exists-advanced-search="false"
          @remove-success="removeSuccess"
        >
          <!--基础查询-->
          <template #baseSearchForm="props">
            <el-col :span="8">
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
          </template>
          <!--控制按钮-->
          <template #controlsLeft>
            <el-button type="success" size="small" icon="plus" @click="add">新增</el-button>
          </template>
          <!--表格-->
          <template #tableColumns>
            <el-table-column label="名称" width="400px" prop="name">
              <template #default="scope">
                <el-button type="primary" text @click="edit(scope.row.id)">
                  {{ scope.row[scope.column.property] }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150px" align="center">
              <template #default="scope">
                <el-button type="primary" text size="small" @click="edit(scope.row.id)">编辑</el-button>
                <el-button type="danger" text size="small" @click="remove(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column label="上级单位" width="300px" prop="parentName">
              <template #default="scope">
                <span>{{ scope.row[scope.column.property] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="编号" prop="code">
              <template #default="scope">
                <span>{{ scope.row[scope.column.property] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="简称" prop="shortName">
              <template #default="scope">
                <span>{{ scope.row[scope.column.property] }}</span>
              </template>
            </el-table-column>
          </template>
        </table-comb>
      </div>
      <CorpForm ref="formRef" @save-success="onSaveSuccess" />
    </d2-container>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Corp',
}
</script>
<script setup>
import { useBasePage } from '@/hooks/useBasePage'
import TreeUtils from '@/utils/tree.utils'

import CorpForm from './corpForm.vue'

const condition = reactive({
  corpId: '',
})

const { formRef, tableRef, title, add, edit, remove, onSaveSuccess } = useBasePage()

const corpTreeOptions = ref([])

onMounted(async () => {
  await loadCorpTreeOptions()
})

function formatData(list) {
  return TreeUtils.listToTree(list, { parentId: 'parentCorpId' })
}

async function loadCorpTreeOptions() {
  corpTreeOptions.value = await $api.sys.corpApi.getSelectTree()
}

async function removeSuccess() {
  await loadCorpTreeOptions()
}

provide('getCorpTreeOptions', () => corpTreeOptions.value)
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
