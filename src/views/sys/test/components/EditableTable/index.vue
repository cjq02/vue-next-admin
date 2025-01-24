<template>
  <table-comb
    ref="tableRef"
    :name="title"
    :get-action="apiUtils.getPage"
    action-url="/test/getPage.json"
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
      <el-col :span="8">
        <el-form-item label="部门名称:">
          <el-input v-model="props.form.name" size="small" clearable placeholder="请输入部门名称" />
        </el-form-item>
      </el-col>
    </template>
    <!--控制按钮-->
    <template #controlsLeft>
      <el-button type="success" size="small" icon="plus" @click="add">新增</el-button>
    </template>
    <!--表格-->
    <template #tableColumns>
      <el-table-column label="排序" width="50" prop="indexNo" align="center" fixed="left" type="index" />
      <el-table-column label="操作" width="150" align="center">
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
            type="primary"
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
      <el-table-column label="编码" prop="code" align="center" width="120">
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
      <el-table-column label="名称" prop="name" min-width="150" header-align="center">
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
      <el-table-column label="项目名称" prop="projectId" min-width="150" show-overflow-tooltip header-align="center">
        <template #default="scope">
          <editable-cell
            v-model="scope.row[scope.column.property]"
            v-model:label="scope.row.projectName"
            placeholder="请选择"
            action-url="/test/getPage.json"
            option-value-field="id"
            option-label-field="name"
            editable-component="paging-select"
            :show-input="scope.row.editMode"
            :prop="`tableData.${scope.$index}.${scope.column.property}`"
            :rules="rules[scope.column.property]"
            tool-tip-content=""
            @cell-click="onCellClick(scope.row)"
          >
            <template #content>
              <div class="ellipsis">{{ scope.row.projectName }}</div>
            </template>
          </editable-cell>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" prop="applyDate" width="150" align="center">
        <template #default="scope">
          <editable-cell
            v-model="scope.row[scope.column.property]"
            editable-component="el-date-picker"
            :show-input="scope.row.editMode"
            :prop="`tableData.${scope.$index}.${scope.column.property}`"
            :rules="rules[scope.column.property]"
            tool-tip-content=""
            type="date"
            class="w100off"
            @cell-click="onCellClick(scope.row)"
          >
            <template #content>
              <div class="ellipsis">{{ $filters.dateFormat(scope.row[scope.column.property], 'YYYY-MM-DD') }}</div>
            </template>
          </editable-cell>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" width="250" show-overflow-tooltip header-align="center">
        <template #default="scope">
          <editable-cell
            v-model="scope.row[scope.column.property]"
            :show-input="scope.row.editMode"
            :prop="`tableData.${scope.$index}.${scope.column.property}`"
            tool-tip-content=""
            minlength="1"
            maxlength="500"
            @cell-click="onCellClick(scope.row)"
          >
            <template #content>
              <div class="ellipsis">{{ scope.row[scope.column.property] }}</div>
            </template>
          </editable-cell>
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="totalAmt" width="150" header-align="center" align="right">
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
              <span>{{ $filters.thousandSeparator(scope.row[scope.column.property]) }}</span>
            </template>
          </editable-cell>
        </template>
      </el-table-column>
    </template>
  </table-comb>
</template>

<script lang="tsx">
export default {
  label: '可编辑表格',
}
</script>
<script setup lang="tsx">
const defaultRowData = {
  code: '',
  id: '',
  name: '',
  type: '',
}

const { tableRef, title, formatData, add, edit, cancel, onCellClick } = useBaseEditPage({
  defaultRowData,
  saveAction: $api.sys.deptApi.saveDept,
})
const condition = reactive({
  name: '',
})

const menuTreeOptions = ref([])

onMounted(async () => {
  menuTreeOptions.value = await $api.sys.menuApi.getMenuTree()
})

const rules = reactive({
  code: [{ message: '请输入', required: true, trigger: ['blur', 'change'] }],
  name: [{ message: '请输入', required: true, trigger: ['blur', 'change'] }],
  type: [{ message: '请选择', required: true, trigger: ['blur', 'change'] }],
})

function save(rowData) {
  cancel(rowData)
}

function remove() {
  $utils.messageUtils.message.success('删除成功')
}
</script>
