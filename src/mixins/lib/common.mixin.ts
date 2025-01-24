import { mapStores } from 'pinia'

import { getToken } from '@/utils/auth'

const mixin = {
  computed: {
    /* store: () => useStore()*/
    ...mapStores(useUserStore, useCodeStore, useBusinessStore),
  },
  created() {
    /* 获取url连接域名，用于多平台迁移*/
    // const localUrl = window.location.href.slice(0, window.location.href.indexOf('/', 9) + 1)
    // const socketUrl = localUrl.replace(/http|https/gi, 'ws')
    // 读取.env 多坏境里的数据
    this.VITE_APP_IMAGE_URL_PRE = import.meta.env.VITE_APP_BASE_URL
    this.VITE_APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL
    // this.VITE_APP_BASE_WS_URL =
    //   import.meta.env.VITE_APP_ENV === 'serve' ? import.meta.env.VITE_APP_BASE_WS_URL : socketUrl
    // 获取token和个人基本信息
    this.accessTokenMixin = getToken()
    this.userBaseInfoMixin = JSON.parse(localStorage.getItem('L_userBaseInfo'))
    /* 获取时间点*/
    this.todayTimeMixin = this.$dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    this.currentTimeMixin = this.$dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    this.todayTimeMixinLast = this.$dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
    this.beforeThreeDateTimeMixin = this.$dayjs().add(-3, 'days').format('YYYY-MM-DD HH:mm:ss')
    this.yesterdayTimeMixin = this.$dayjs().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
  data() {
    return {
      // 请求的url地址
      VITE_APP_BASE_URL: '',
      // 请求的url地址
      VITE_APP_BASE_WS_URL: '',
      // 图片前缀地址
      VITE_APP_IMAGE_URL_PRE: '',

      // 请求头的token
      accessTokenMixin: '',

      beforeThreeDateTimeMixin: '',

      chooseFileNameMixin: '',
      /* 多环境配置及token信息*/
      commonValueMixin: '',
      currentTimeMixin: '',
      /* 文件上传相关*/
      fileListMixin: [],

      modalShowTitleMixin: '',

      /* 时间点相关*/
      todayTimeMixin: '',

      todayTimeMixinLast: '',
      // 用户信息
      userBaseInfoMixin: {},
      yesterdayTimeMixin: null,
    }
  },
  methods: {
    /*
     * 清空空的参数项
     * objParam：传入的参数
     * */
    clearParamsIsNullMixin(objParam) {
      const obj = Object.keys(objParam)
      obj.forEach((fItem) => {
        if (objParam[fItem] === '' || objParam[fItem] === null || objParam[fItem] === undefined) delete objParam[fItem]
      })
      return objParam
    },

    /* 数组操作相关api*/
    /*
     * 根据key名称过滤数组
     * arr:数组
     * key：数值对象总的key
     * */
    filterArrMixin(arr, key) {
      const hash = {}
      return arr.reduce((ss, item) => {
        hash[item[key]] ? '' : (hash[item[key]] = ss.push(item))
        return ss
      }, [])
    },
    goUploadFileMixin() {
      this.$refs.refSettingFile.click()
    },
    /* 文件上传*/
    handleChangeMixin(file, fileListMixin) {
      console.log('file, fileListMixin', file, fileListMixin)
      this.fileListMixin = fileListMixin
    },

    resetDataMixin(form) {
      Object.keys(form).forEach((sItem) => {
        form[sItem] = ''
      })
    },
    reshowDataMixin(row, form) {
      Object.keys(row).forEach((fItem) => {
        Object.keys(form).forEach((sItem) => {
          if (fItem === sItem) {
            form[sItem] = row[sItem]
          }
        })
      })
    },
    sleepMixin(time) {
      return new Promise((resolve) => {
        const timer = setTimeout(() => {
          clearTimeout(timer)
          resolve(null)
        }, time)
      })
    },
  },
}

export default mixin
