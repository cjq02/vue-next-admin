<template>
  <el-row>
    <el-col :span="8">
      <paging-select
        v-model="model.userId"
        v-model:label="model.userName"
        placeholder="请选择"
        action-url="/sys/user/getUserPage.json"
        option-value-field="id"
        option-label-field="realName"
        multiple
        collapse-tags
        collapse-tags-tooltip
        auto-fetch
        @change="handleChange"
      ></paging-select>
    </el-col>
  </el-row>
  <el-row class="mt20">
    <el-col :span="8">
      <el-select v-model="value" placeholder="Select" size="small">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-col>
  </el-row>
  <el-row class="mt20">
    <el-col :span="8">
      <el-select
        v-model="value"
        multiple
        filterable
        remote
        reserve-keyword
        placeholder="Please enter a keyword"
        :remote-method="remoteMethod"
        :loading="loading"
        :suffix-icon="Search"
      >
        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-col>
  </el-row>
</template>
<script lang="ts">
export default {
  label: '多选下拉',
}
</script>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

const model = reactive({
  userId:
    '8cab3de0bc744368a6182e80dc021e94,79acd6f7033a4d4f9d687dff978071e4,38fd3ea7ad6f485ba6033637873536fc,18e9178042854155b3c561639ebdc17a,1d322543b0d8460c8c02af632020321a,1ea57a4d0d334b7b9e76c517aae1db3c',
  userName: '淘专家,08超管,地地道道,对的,陈普通新增,16专家',
  users: [],
})

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]

interface ListItem {
  value: string
  label: string
}

const list = ref<ListItem[]>([])
const options2 = ref<ListItem[]>([])
const value = ref<string[]>([])
const loading = ref(false)

onMounted(() => {
  list.value = states.map((item) => {
    return { value: `value:${item}`, label: `label:${item}` }
  })
})

const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      options2.value = list.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    options2.value = []
  }
}

const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
]

function handleChange(value) {
  console.log(value)
}
</script>
