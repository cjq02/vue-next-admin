<!--suppress TypeScriptValidateTypes -->
<!--suppress TypeScriptUnresolvedReference -->
<template>
  <FormWrapper ref="formWrapper" :title="title" @after-back="afterBack">
    <template #container>
      <div class="form-box">
        <el-form ref="formRef" :model="model" :rules="rules" label-width="120px" style="padding: 30px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="名称" prop="name">
                <el-input v-model="model.name" minlength="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="父菜单" prop="parentId">
                <el-cascader
                  v-model="model.parentId"
                  :options="menuTreeOptions"
                  :props="{ checkStrictly: true, emitPath: false }"
                  :show-all-levels="false"
                  style="width: 100%"
                  @change="handleParentIdChange"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地址" prop="url">
                <el-input v-model="model.url" minlength="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序" prop="priority">
                <el-input-number v-model="model.priority" :min="0" :max="999" :step="10" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="权限前缀码" prop="permissionPrefixCode">
                <el-input v-model="model.permissionPrefixCode" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述" prop="description">
                <el-input v-model="model.description" minlength="1" maxlength="200" show-word-limit type="textarea" />
              </el-form-item>
            </el-col>
            <el-col v-show="false" :span="12">
              <el-form-item label="角色类型">
                <el-select v-model="model.roleType" placeholder="请选择角色类型" multiple>
                  <el-option
                    v-for="item in codeStore.lists['ROLE_TYPE']"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-show="false" :span="12">
              <el-form-item label-width="30px">
                <el-button type="primary" size="small" plain>一键下放</el-button>
                <el-button type="primary" size="small" plain>一键回收</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="权限">
                <el-button type="success" size="small" icon="plus" @click="addPermission">新增</el-button>
                <el-button type="warning" size="small" icon="plus" @click="addCustomPermission">
                  新增自定义权限
                </el-button>
                <el-table
                  ref="permissionTable"
                  :data="model.permissions"
                  style="width: 100%"
                  class="mt20"
                  border
                  max-height="450"
                >
                  <el-table-column label="操作" width="120" align="center">
                    <template #default="scope">
                      <el-button
                        type="primary"
                        text
                        size="small"
                        icon="delete"
                        @click="deletePermission(scope.$index, scope.row.id)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="权限码" min-width="200px">
                    <template #default="scope">
                      <!--suppress TypeScriptUnresolvedReference -->
                      <el-form-item :prop="'permissions.' + scope.$index + '.code'" :rules="permissionRules.code">
                        <el-input v-if="scope.row.isCustom === TRUE" v-model="scope.row.code">
                          <template #prepend>{{ permissionPrefixCodeWithColon }}</template>
                        </el-input>
                        <el-select
                          v-else
                          v-model="scope.row.code"
                          placeholder="请选择权限"
                          value-key="item"
                          @change="handlePermissionChange"
                          @visible-change="handlePermissionVisibleChange"
                        >
                          <el-option
                            v-for="item in permissionOptions"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                            :disabled="item.disabled"
                          />
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="权限名称" min-width="150px" align="center">
                    <template #default="scope">
                      <el-form-item :prop="'permissions.' + scope.$index + '.name'" :rules="permissionRules.name">
                        <el-input
                          v-if="scope.row.isCustom === TRUE"
                          v-model="scope.row.name"
                          input-style="text-align: center"
                        ></el-input>
                        <span v-else>{{ scope.row.name }}</span>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="description" label="描述" min-width="300px" show-overflow-tooltip>
                    <template #default="scope">
                      <el-form-item :prop="'permissions.' + scope.$index + '.description'">
                        <el-input
                          v-model="scope.row.description"
                          size="small"
                          style="text-align: center"
                          maxlength="50"
                          show-word-limit
                          controls-position="right"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </template>
    <template #footer>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="back">关闭</el-button>
    </template>
  </FormWrapper>
</template>
<script setup lang="ts">
import { baseEmits, useBaseForm } from '@/hooks/useBaseForm'

const codeStore = useCodeStore()

const emit = defineEmits(baseEmits)

const defaultPermissionOptions = [
  {
    key: 'view',
    label: '查看',
    value: '',
    disabled: false,
  },
  {
    key: 'edit',
    label: '编辑',
    value: '',
    disabled: false,
  },
  {
    key: 'delete',
    label: '删除',
    value: '',
    disabled: false,
  },
]
const ROOT_ID = '1'

const defaultFormData = {
  id: null,
  name: '',
  permissionPrefixCode: '',
  url: '',
  priority: 0,
  parentId: '',
  permissions: [],
}

const options = {
  defaultFormData,
  getAction: $api.sys.menuApi.getMenuById,
  afterLoadData: () => {
    _.each(model.permissions, (item) => {
      item.isCustom = _.some(permissionOptions.value, { value: item.code }) ? FALSE : TRUE
      if (item.isCustom === TRUE) {
        item.code = item.code.replace(permissionPrefixCodeWithColon.value, '')
      }
    })
  },
}

const { formWrapper, formRef, model, title, open, back, afterBack } = useBaseForm(options, emit)

const state = reactive({
  menuList: [],
  permissionOptions: Object.assign({}, defaultPermissionOptions),
  rules: {
    name: [
      { required: true, message: '请输入菜单名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
    ],
    permissionPrefixCode: [
      { required: true, message: '请输入权限前缀码', trigger: 'blur' },
      { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
    ],
    url: [
      { required: true, message: '请输入地址', trigger: 'blur' },
      { minmax: 200, message: '长度200个字符以内', trigger: 'blur' },
      { pattern: /^\//, message: '地址格式不正确（需“/”开头）', trigger: 'blur' },
    ],
    priority: [{ required: true, message: '请输入排序', trigger: 'blur' }],
    description: [{ max: 200, message: '长度在200个字符以内', trigger: 'blur' }],
  },
  permissionRules: {
    code: [
      {
        validator: (rule, value, callback) => {
          const rowIndex = Number(rule.field.split('.')[1])
          const rowData = model.permissions[rowIndex]

          if (!value) {
            return callback(new Error(`${rowData.isCustom === TRUE ? '请输入' : '请请选择'}权限码`))
          }
          if (_.some(permissionOptions.value, { key: value })) {
            return callback(new Error('不能与权限码下拉选项重复'))
          }
          return callback()
        },
        trigger: ['blur'],
      },
    ],
    name: [
      {
        validator: (rule, value, callback) => {
          const rowIndex = Number(rule.field.split('.')[1])
          const rowData = model.permissions[rowIndex]
          if (!value) {
            return callback(new Error('请输入权限名称'))
          }
          if (rowData.isCustom === TRUE && _.some(permissionOptions.value, { label: value })) {
            return callback(new Error('不能与权限码下拉选项重复'))
          }
          return callback()
        },
        trigger: ['blur'],
      },
    ],
    description: [{ max: 50, message: '长度在50个字符以内', trigger: 'blur' }],
  },
})

const { permissionOptions, rules, permissionRules } = toRefs(state)

const menuTreeOptions = computed(() => {
  const list = state.menuList.filter((item) => item.parentId === ROOT_ID || item.id === ROOT_ID)
  return $utils.treeUtils.listToTree(list)
})

const permissionPrefixCodeWithColon = computed(() => model.permissionPrefixCode + ':')

onMounted(async () => {
  await fetchMenuList()
})

watch(
  () => model.permissionPrefixCode,
  (val) => {
    // 首字母大写
    model.permissionPrefixCode = (val.charAt(0).toUpperCase() + val.slice(1)).trim()
    _.each(permissionOptions.value, (item) => {
      item.value = `${val}:${item.key}`
    })
    _.each(model.permissions, (item) => {
      if (!_.isEmpty(item.code)) {
        const permissionOption = _.find(permissionOptions.value, { label: item.name }) as any
        if (commonUtils.isNotEmpty(permissionOption)) {
          item.code = permissionOption.value
        }
      }
    })
  },
)

async function openByCopy(id) {
  await open(id)
  Object.assign(model, {
    id: undefined,
    name: '',
    permissionPrefixCode: '',
    permissions: [],
  })
}

async function fetchMenuList() {
  state.menuList = await $api.sys.menuApi.getRootMenuTreeSelectList()
}

async function save() {
  try {
    await formRef.value.validate()
    const saveData = Object.assign({}, model)
    saveData.permissions = _.map(model.permissions, (item) => {
      if (item.isCustom === TRUE) {
        item.code = `${permissionPrefixCodeWithColon.value}${item.code}`
      }
      return item
    })
    delete saveData.parent
    delete saveData.children
    const res = await $api.sys.menuApi.save(saveData)
    await $utils.messageUtils.showResponseMessage(res)
    back()
    emit('save-success')
    await fetchMenuList()
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

function handleParentIdChange(value) {
  const parent = $utils.treeUtils.getNodeById(menuTreeOptions, value)
  if ($utils.isEmpty(model.url)) {
    model.url = parent.url.replace('#', '')
  }
  model.priority =
    _(state.menuList)
      .filter((item) => item.parentId === value && item.priority < 900)
      .map('priority')
      .max() + 10
}

function handlePermissionChange(value) {
  const currentPermissionRow = _.find(model.permissions, { code: value })
  const selectedOption = _.find(permissionOptions.value, { value }) as any
  currentPermissionRow.name = selectedOption.label
}

function handlePermissionVisibleChange(visible) {
  if (visible) {
    setSelectedPermissionDisabled()
  }
}

function setSelectedPermissionDisabled() {
  _.each(permissionOptions.value, (item) => {
    item.disabled = _.filter(model.permissions, { code: item.value }).length > 0
  })
}

async function deletePermission(index, id) {
  if (_.isEmpty(id)) {
    return model.permissions.splice(index, 1)
  }
  await messageUtils.confirm('确定删除该记录？')
  const res = await $api.sys.menuApi.deletePermission(id)
  await messageUtils.showResponseMessage(res)
  model.permissions.splice(index, 1)
}

function addPermission() {
  if (_.isEmpty(model.permissionPrefixCode)) {
    return messageUtils.message.warning('权限码不能为空！')
  }

  if (_.isEmpty(model.permissions)) {
    model.permissions = []
  }

  if (_.filter(model.permissions, { isCustom: FALSE }).length === 3) {
    return
  }
  const newRow = {
    name: '',
    isCustom: FALSE,
  }
  model.permissions.push(newRow)
}

function addCustomPermission() {
  const newRow = {
    code: '',
    name: '',
    isCustom: TRUE,
  }
  model.permissions.push(newRow)
}

defineExpose({ open, openByCopy })
</script>

<style lang="scss" scoped>
.form-box {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
}
</style>
