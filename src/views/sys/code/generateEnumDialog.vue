<template>
  <el-dialog v-model="visible" title="生成枚举" width="800px">
    <el-form ref="formRef" :model="model" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="枚举包路径" prop="packagePath">
            <el-select v-model="model.packagePath" filterable clearable allow-create>
              <el-option v-for="item in packageOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="枚举类名" prop="enumClassName">
            <el-input v-model="model.enumClassName" minlength="1" placeholder="请输入枚举包路径" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否生成备注" prop="active">
            <el-switch v-model="model.hasRemark" :active-value="TRUE" :inactive-value="FALSE" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="confirm">确定</el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'

const { proxy } = getCurrentInstance()

const emit = defineEmits(['save-success'])

const defaultFormData = {
  typeCode: '',
  typeName: '',
  enumClassName: '',
  packagePath: '',
  hasRemark: FALSE,
}

const formRef = ref(null)
const visible = ref(false)
const loading = ref(false)
const packageOptions = ref(null)

const model = reactive({ ...defaultFormData })
const rules = reactive({
  packagePath: [{ required: true, message: '请填写枚举包路径', trigger: 'blur' }],
  enumClassName: [{ required: true, message: '请填写枚举类名', trigger: 'blur' }],
})

onMounted(async () => {
  packageOptions.value = await $api.sys.codeApi.findEnumPackageList()
})

function show(typeCode, typeName) {
  visible.value = true
  model.typeCode = typeCode
  model.typeName = typeName
  model.enumClassName =
    _.map(model.typeCode.toLocaleLowerCase().split('_'), (item) => {
      return _.capitalize(item)
    }).join('') + 'Enum'
}

async function confirm() {
  try {
    await formRef.value.validate()
    loading.value = true
    const res = await $api.sys.codeApi.generateEnum(model)
    loading.value = false
    await proxy.$showResponseMessage(res).catch((e) => {
      throw e
    })
    visible.value = false
    emit('save-success')
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

defineExpose({ show })
</script>
