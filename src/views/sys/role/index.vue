<!--suppress HtmlUnknownAttribute, HtmlUnknownTag, JSUnresolvedVariable -->
<template>
  <d2-container class="edit-panel">
    <template #header>
      <el-row>
        <el-col :span="24">
          <h3 class="tc" style="margin-top: 5px">{{ $utils.isEmpty(model.id) ? '新增' : '编辑' }}{{ title }}</h3>
        </el-col>
      </el-row>
    </template>
    <el-container style="height: 100%">
      <el-aside width="300px" class="main-left">
        <div class="tit clearfix">
          <label>角色列表</label>
          <div class="btn-wrap fr">
            <el-button size="small" type="success" @click="add">新增</el-button>
            <el-button size="small" type="danger" @click="remove">删除</el-button>
          </div>
        </div>
        <div class="left-filter">
          <el-input v-model="keyword" :prefix-icon="Search" size="small" clearable placeholder="请输入名称" />
        </div>
        <div class="left-menu">
          <el-scrollbar>
            <el-menu
              ref="menuRef"
              :default-active="model.id"
              class="el-menu-vertical-demo"
              style="width: 100%; height: 100%"
              @select="handleMenuSelect"
            >
              <el-menu-item v-for="item in roleList" :key="item.id" :index="item.id" :title="item.name">
                <el-icon><document /></el-icon>
                <template #title>{{ item.name }}</template>
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
        </div>
      </el-aside>
      <el-main class="main-right">
        <el-form
          ref="formRef"
          :model="model"
          :rules="rules"
          label-width="90px"
          label-position="right"
          style="padding: 0 20px"
        >
          <el-row>
            <el-col :span="14">
              <el-row style="padding-top: 40px">
                <el-col :span="24">
                  <el-form-item label="名称" prop="name">
                    <el-input v-model="model.name" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="角色类型" prop="roleType">
                    <el-select v-model="model.roleType" placeholder="请选择角色类型">
                      <el-option
                        v-for="item in codeStore.lists['ROLE_TYPE']"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="10">
              <el-form-item
                label=""
                prop="permissionIds"
                label-width="60px"
                style="margin-bottom: 0 !important; padding-bottom: 0"
              >
                <div class="header-tit">权限配置</div>
                <el-card class="box-card" shadow="hover">
                  <el-scrollbar :height="getTreeHeight()">
                    <el-tree
                      ref="permissionTreeRef"
                      :data="permissionTreeData"
                      show-checkbox
                      node-key="id"
                      :default-expanded-keys="defaultExpandedKeys"
                      @change="handlePermissionTreeChange"
                    />
                  </el-scrollbar>
                </el-card>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
    </el-container>
    <template #footer>
      <div class="btn-wrap tc">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </template>
  </d2-container>
</template>
<script lang="ts">
export default {
  name: 'Role',
}
</script>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

import { baseEmits } from '@/hooks/useBaseForm'

const codeStore = useCodeStore()
const emit = defineEmits(baseEmits)

const defaultFormData = {
  id: '',
  name: '',
  permissionIds: [],
  roleType: '',
}

// noinspection JSUnusedGlobalSymbols
const options = {
  afterSave: async (id) => {
    model.id = id
    await init()
  },
  defaultFormData,
  getSaveData: () => {
    return { ...model }
  },
  saveAction: apiUtils.saveAction('/sys/role/save.json'),
}
const { formRef, title, model, save } = useBaseForm(options, emit)

const list = ref([])
const permissionTreeRef = ref()
const permissionTreeData = ref([])
const keyword = ref('')

const rules = reactive({
  name: [{ message: '请填写', required: true, trigger: 'blur' }],
  roleType: [{ message: '请选择', required: true, trigger: 'blur' }],
})

const defaultExpandedKeys = computed(() => _.map(permissionTreeData.value, 'id'))
const roleList = computed(() => list.value.filter((item) => item.name.includes(keyword.value)))

onMounted(async () => {
  await init()
})

async function init() {
  list.value = await $api.sys.roleApi.findRoleSelectList()
  permissionTreeData.value = await $api.sys.menuApi.getMenuTreeWithPermission()
  if (list.value.length > 0) {
    if (!_.some(list.value, { id: model.id })) {
      model.id = list.value[0].id
    }
    await handleMenuSelect(model.id)
  } else {
    reset()
  }
}

function getTreeHeight() {
  return formRef.value?.$el.parentElement.clientHeight - 100
}

function add() {
  reset()
}

async function remove() {
  await $utils.messageUtils.confirm('确定删除吗？')
  const res = await apiUtils.remove(model.id, '/sys/role/deleteRole.json')
  await $utils.messageUtils.showResponseMessage(res)
  await init()
}

async function handleMenuSelect(id) {
  Object.assign(model, await $api.sys.roleApi.getRoleById(id))
  const checkedPermissionKeys = await $api.sys.roleApi.findPermissionIdsByRoleId(id)
  permissionTreeRef.value.setCheckedKeys(checkedPermissionKeys)
  handlePermissionTreeChange()
}

function handlePermissionTreeChange() {
  model.permissionIds = permissionTreeRef.value.getCheckedKeys(true)
}

function reset() {
  Object.assign(model, defaultFormData)
  permissionTreeRef.value.setCheckedKeys([])
}

function close() {
  $utils.closeTab()
}
</script>
<style lang="scss" scoped>
.main-left {
  overflow: hidden;
  border-right: 1px solid #cfd7e5;
  > .tit {
    padding: 10px 20px 0;
    line-height: 30px;
    > label {
      font-weight: bold;
      font-size: 15px;
      color: #333;
    }
  }
  .left-filter {
    padding: 10px 20px;
  }
  .left-menu {
    overflow: hidden;
    margin: 0 20px;
    border: 1px solid #d9d9d9;
    height: calc(100% - 110px);
  }
  .el-menu {
    box-sizing: border-box;
    padding: 10px 0;
    border-right: none;
    .el-menu-item {
      display: block;
      overflow: hidden;
      margin-bottom: 1px;
      height: 40px;
      line-height: 40px;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      &:hover {
        background: #f5f7fa;
      }
      &.is-active {
        background-color: var(--el-menu-hover-bg-color) !important;
      }
    }
  }
}
.header-tit {
  padding: 0 0 5px;
  line-height: 30px;
  font-weight: bold;
  font-size: 15px;
  color: #333;
}
:deep(.el-card__header) {
  padding: 5px 20px;
  line-height: 30px;
}
:deep(.el-card__body) {
  padding: 10px 0;
  .el-tree {
    padding: 0 10px;
  }
}
</style>
