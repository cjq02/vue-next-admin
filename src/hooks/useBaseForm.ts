export const baseEmits = ['after-open', 'save-success', 'after-back']

interface IFormOptions {
  defaultFormData: any
  getAction?: (id) => any
  getActionParams?: (params) => any
  saveAction?: (id) => any
  getSaveData?: (params) => any
  getSubmitData?: () => any
  afterOpen?: (id, formFlag) => void
  afterLoadData?: (id) => Promise<any> | void
  beforeSave?: () => any
  afterValidate?: () => any
  afterSave?: (info) => void
  afterSubmit?: (info) => void
}

interface ISaveOptions {
  savedThenBack?: boolean
  isSubmit?: boolean
  submitConfirmMessage?: string
  skipValidate?: boolean
}

export interface IFormResult {
  formWrapper?: any
  formRef?: any
  title?: Ref<string>
  model?: any
  openParams?: any
  basePageTableData?: any
  loading?: Ref<boolean>
  open?: (id?: string, formFlag?: string, openOptions?: any) => Promise<any>
  loadData?: (id: string) => void
  save?: (options?: ISaveOptions) => Promise<any>
  submit?: (options?: ISaveOptions) => void
  resetForm?: () => void
  back?: () => void
  afterBack?: () => void
  saveLoading?: Ref<boolean>
}

export function useBaseForm(options?: IFormOptions, emit?): IFormResult {
  const {
    defaultFormData,
    getAction,
    getActionParams,
    saveAction,
    getSaveData,
    beforeSave,
    afterValidate,
    afterSave,
    afterLoadData,
    afterOpen,
  } = options || {}

  const getTableData = inject('getTableData')
  // @ts-ignore
  const basePageTableData = computed(() => getTableData())

  const route = useRoute()
  const loading = ref(true)
  const saveLoading = ref(false)
  const formWrapper = ref()
  const formRef = ref()
  const openParams = ref({})

  const state = reactive({
    idKeyName: 'id',
  })

  const model = reactive({
    ...defaultFormData,
  })

  const title = computed(() => {
    const title = route.meta.title!.toString()
    if (['管理', '维护', '配置'].some((str) => title.endsWith(str))) {
      return title.slice(0, -2)
    }
    return title
  })

  async function open(id, formFlag, openOptions?) {
    const { showFormFlag = true, idKeyName = 'id', params = {} } = openOptions || {}
    if ($utils.isEmpty(formFlag)) {
      formFlag = _.isEmpty(id) ? Constants.formFlag.ADD : Constants.formFlag.EDIT
    }
    if (showFormFlag) {
      formWrapper.value.formFlag = formFlag
    }
    formWrapper.value.open()
    state.idKeyName = idKeyName
    model[idKeyName] = id
    openParams.value = params
    if (_.includes([Constants.formFlag.VIEW, Constants.formFlag.EDIT], formFlag)) {
      await loadData(model[idKeyName]).finally(() => {
        if ($utils.isEmpty(model[idKeyName])) {
          model[idKeyName] = id
        }
        setTimeout(() => {
          formRef.value?.clearValidate()
          loading.value = false
        }, 200)
      })
      if (typeof afterLoadData === 'function') {
        await afterLoadData(model[idKeyName])
      }
    } else {
      loading.value = false
    }
    if (typeof afterOpen === 'function') {
      await nextTick(() => {
        afterOpen(model[idKeyName], formFlag)
      })
    }
  }

  async function loadData(id = model[state.idKeyName]) {
    if (typeof getAction === 'function') {
      let params = id
      if (typeof getActionParams === 'function') {
        params = getActionParams(openParams.value)
      }
      Object.assign(model, await getAction(params))
    }
  }

  function resetForm() {
    formRef.value?.resetFields()
    $utils.clearObjectValue(model)
    Object.assign(model, defaultFormData)
  }

  async function save({
    savedThenBack = true,
    isSubmit = false,
    submitConfirmMessage = '确定提交吗？',
    skipValidate = false,
  }: ISaveOptions = {}) {
    try {
      if (typeof beforeSave === 'function') {
        const result = beforeSave()
        if (result === false) {
          return Promise.reject()
        }
        if (result instanceof Promise) {
          const res = await result
          // res为undefined或null时通过（!res?.success与res?success === false不相等）
          if (res?.success === false) {
            return Promise.reject()
          }
        }
      }
      formRef.value.clearValidate()
      if (!skipValidate) {
        await formRef.value.validate().catch((e) => {
          $utils.messageUtils.message.error('存在必填信息未填写或数据错误，请检查！')
          throw e
        })
      }
      if (typeof afterValidate === 'function') {
        const result = afterValidate()
        if (result === false) {
          return result
        }
      }
      if (isSubmit) {
        await $utils.messageUtils.confirm(submitConfirmMessage)
      }
      saveLoading.value = true
      const requestData = _.isFunction(getSaveData) ? getSaveData({ data: model, isSubmit }) : model
      const res = await saveAction!(requestData)
      await $utils.messageUtils.showResponseMessage(res).catch((e) => {
        throw e
      })
      if (savedThenBack) {
        back()
      } else {
        if ($utils.isNotEmpty(res.info)) {
          if (_.isObject(res.info)) {
            model.id = res.info.id
          } else {
            model.id = res.info
          }
        }
      }
      if (typeof afterSave === 'function') {
        afterSave(res.info)
      }
      emit('save-success')
      saveLoading.value = false
      return res
    } catch (e) {
      console.error(e)
      saveLoading.value = false
      return Promise.reject()
    }
  }

  function submit(options?: ISaveOptions) {
    return save({ isSubmit: true, savedThenBack: true, ...options })
  }

  function back() {
    formWrapper.value?.back()
  }

  function afterBack() {
    resetForm()
    loading.value = true
    emit('after-back')
  }

  return {
    afterBack,
    back,
    basePageTableData,
    formRef,
    formWrapper,
    loadData,
    loading,
    model,
    open,
    openParams,
    resetForm,
    save,
    saveLoading,
    submit,
    title,
  }
}
