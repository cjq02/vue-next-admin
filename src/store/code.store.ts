import { defineStore } from 'pinia'

import TCodeMap = CodeModule.TCodeMap
import { useCode } from '@/hooks/useCode'

const useCodeStore = defineStore('code', () => {
  const codeMap = ref({})

  const keyMaps = computed(() => _.mapValues(codeMap.value, 'keyMaps') as TCodeMap)
  const lists = computed(() => _.mapValues(codeMap.value, 'options') as TCodeMap)
  const maps = computed(() => _.mapValues(codeMap.value, 'map') as TCodeMap)

  function getCodeInfo(typeCode, value) {
    return keyMaps.value[typeCode][value]
  }

  function getName(typeCode, value) {
    return maps.value[typeCode][value]
  }

  async function loadCodeMap() {
    const { extendMap } = useCode()
    const groupMap = await codeApi.getCodeGroupMapFromCache()
    _.each(groupMap, (codeList, typeCode) => {
      const codeCache: any = {
        keyMaps: {},
        map: {},
        options: [],
      }
      codeCache.map = commonUtils.mapKeyValue(codeList, 'configCode', 'configName')
      codeCache.options = _.map(codeList, (item) =>
        _.assign(
          {
            label: item.configName,
            value: item.configCode,
          },
          item,
        ),
      )
      codeCache.keyMaps = commonUtils.mapKeyValue(codeCache.options, 'configCode', (value) => value)
      codeMap.value[typeCode] = codeCache
      _.merge(codeCache.keyMaps, extendMap[typeCode])
    })
  }

  function getByCode(typeCode, configCode) {
    return _.find(lists.value[typeCode], { configCode })
  }

  return { codeMap, getByCode, getCodeInfo, getName, keyMaps, lists, loadCodeMap, maps }
})

export default useCodeStore
