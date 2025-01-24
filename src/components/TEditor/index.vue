<template>
  <Editor ref="editorRef" v-model="content" :init="editorOptions" :disabled="disabled" />
</template>

<script setup>
/* eslint-disable camelcase */
import 'http://bj.readforchina.com/tinymce/5.10.2/tinymce.min.js'
import './plugins'

import Editor from '@tinymce/tinymce-vue'

import { fonts } from './fonts'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  bottomOffsetHeight: {
    default: 0,
    type: Number,
  },
  disabled: {
    default: false,
    type: Boolean,
  },
  height: {
    default: 400,
    type: Number,
  },
  maxHeight: {
    default: 400,
    type: Number,
  },
  minHeight: {
    default: 400,
    type: Number,
  },
  modelValue: {
    default: '',
    type: String,
  },
  placeholder: {
    default: '在这里输入文字...',
    type: String,
  },
  plugins: {
    default: 'wordcount autoresize table image code preview fullscreen',
    type: [String, Array],
  },
  resetHeightDisabled: {
    default: false,
    type: Boolean,
  },
  toolbar: {
    // 工具条
    default:
      'undo redo | bold italic underline strikethrough  | fontselect | fontsizeselect | formatselect  | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent| removeformat| undo redo | link unlink image  table  hr | code preview fullscreen',

    type: [String, Array],
  },
  topOffsetHeight: {
    default: -1,
    type: Number,
  },
})
const editorRef = ref(null)
const content = ref('')

watch(
  () => props.modelValue,
  // eslint-disable-next-line no-return-assign
  (newValue) => (content.value = newValue),
)
watch(
  () => content.value,
  (newValue) => emit('update:modelValue', newValue),
)

const editorOptions = reactive({
  // tiny技术支持信息是否显示
  branding: false,
  // 以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
  content_css: '/tinymce/skins/content/default/content.css',

  // 元素路径是否显示
  elementpath: false,
  elements: 'elm1',

  font_formats: fonts.join(';'),

  // 字体大小
  fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px',

  images_upload_handler: async (blobInfo, success, failure) => {
    // 自定义上传逻辑
    const formdata = new FormData()
    formdata.append('file', blobInfo.blob(), blobInfo.filename())
    const res = await apiUtils.upload('/file/textUpload.json', formdata)
    if (res.success) {
      success(apiUtils.API_PREFIX + res.info)
    } else {
      failure('上传失败！')
    }
  },
  /**
   * 初始化回调
   * */
  init_instance_callback: (editor) => {
    // 字数统计 - 按字符数量统计
    jq(editor.getContainer()).find('button.tox-statusbar__wordcount').click()
    setEditorHeight(editor)
  },

  // 语言类型
  language: 'zh_CN',
  // 引入语言包文件
  language_url: '/tinymce/langs/zh_CN.js',

  max_height: props.maxHeight,

  menubar: false,

  min_height: props.minHeight,

  placeholder: props.placeholder,

  // 插件配置
  plugins: props.plugins,

  // 编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
  resize: false,

  // 皮肤：浅色
  skin_url: '/tinymce/skins/ui/oxide',

  // 工具栏配置，设为false则隐藏
  toolbar: props.toolbar,
})
function setEditorHeight(editor) {
  if (props.resetHeightDisabled) {
    return
  }
  const bottomOffset = props.bottomOffsetHeight
  let topOffset = props.topOffsetHeight
  if (topOffset === -1) {
    topOffset = editor.container.getBoundingClientRect().top
  }
  const height = window.innerHeight - topOffset - bottomOffset - 40
  if (height > props.minHeight) {
    editor.container.style.height = height + 'px'
  }
  console.log('height', height, editor.container.style.height, editor)
}
</script>
<style scoped></style>
