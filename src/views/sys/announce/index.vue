<template>
  <div>
    <d2-container>
      <div class="app-container">
        <table-comb
          ref="tableRef"
          :name="title"
          :get-action="apiUtils.getPage"
          action-url="/announce/getPage.json"
          :remove-action="apiUtils.remove"
          remove-action-url="/announce/del.json"
          :base-search-model="condition"
          :show-search-form="true"
          :show-controls="true"
          :show-default-controls-right="true"
          :auto-fetch="false"
          :exists-advanced-search="false"
        >
          <!--基础查询-->
          <template #baseSearchForm="props">
            <el-col :span="8">
              <el-form-item label="标题:">
                <el-input v-model="props.form.title" size="small" clearable placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col v-if="!isView" :span="8">
              <el-form-item label="状态:">
                <el-select v-model="props.form.status" placeholder="请选择" filterable clearable auto-complete="off">
                  <el-option
                    v-for="item in codeStore.lists['ANNOUNCE_STATUS']"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <!--控制按钮-->
          <template #controlsLeft>
            <el-button v-if="!isView" type="success" icon="plus" @click="add">新增</el-button>
          </template>
          <!--表格-->
          <template #tableColumns>
            <el-table-column label="操作" width="200" align="center">
              <template #default="scope">
                <el-button type="primary" size="small" text @click="view(scope.row.id)">预览</el-button>
                <el-button
                  v-if="!isView && scope.row.status !== Code.ANNOUNCE_STATUS._1"
                  type="primary"
                  size="small"
                  text
                  @click="edit(scope.row.id)"
                >
                  编辑
                </el-button>
                <el-button v-if="!isView" type="danger" size="small" text @click="remove(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column label="标题" show-overflow-tooltip header-align="center">
              <template #default="scope">
                <el-link @click="view(scope.row.id)">{{ scope.row.title }}</el-link>
              </template>
            </el-table-column>
            <el-table-column v-if="!isView" label="创建时间" width="150" align="center">
              <template #default="scope">
                {{ $filters.dateFormat(scope.row.createTs, 'YYYY-MM-DD') }}
              </template>
            </el-table-column>
            <el-table-column label="发布时间" width="150" align="center">
              <template #default="scope">
                {{
                  scope.row.status === Code.ANNOUNCE_STATUS._1
                    ? $filters.dateFormat(scope.row.updateTs, 'YYYY-MM-DD')
                    : ''
                }}
              </template>
            </el-table-column>
            <el-table-column v-if="!isView" label="状态" width="100" align="center">
              <template #default="scope">
                <el-tag v-if="columnCodeMap[scope.row.id]" effect="dark" :type="columnCodeMap[scope.row.id].type">
                  {{ columnCodeMap[scope.row.id].label }}
                </el-tag>
              </template>
            </el-table-column>
          </template>
        </table-comb>
      </div>
    </d2-container>
    <AnnounceForm ref="formRef" @save-success="onSaveSuccess" />
    <AnnounceView ref="viewRef" @save-success="onSaveSuccess" />
  </div>
</template>
<script>
export default {
  // eslint-disable-next-line
  name: 'Announce'
}
</script>
<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'

import { useBasePage } from '@/hooks/useBasePage'

import AnnounceForm from './announceForm.vue'
import AnnounceView from './announceView.vue'

const { proxy } = getCurrentInstance()

const viewRef = ref(null)
const isView = ref(false)

const condition = reactive({
  isView: FALSE,
  status: '',
  title: '',
})

const { formRef, tableRef, title, add, edit, remove, onSaveSuccess, extendColumnCodeProps } = useBasePage()

const columnCodeMap = computed(() => {
  return extendColumnCodeProps('status', 'ANNOUNCE_STATUS', {
    [Code.ANNOUNCE_STATUS._0]: { type: 'warning' },
    [Code.ANNOUNCE_STATUS._1]: { type: 'success' },
  })
})

onMounted(async () => {
  isView.value = proxy.$route.query.isView || false
  if (isView.value) {
    condition.isView = TRUE
    condition.status = Code.ANNOUNCE_STATUS._1
  }
  await proxy.$nextTick()
  tableRef.value.fetchData()
})

async function view(id) {
  await viewRef.value.open(id)
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.pagination {
  padding: 32px 16px;
  background: #fff;
}
</style>
