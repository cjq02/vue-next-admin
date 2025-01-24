import { defineStore } from 'pinia'

const useBusinessStore = defineStore('business', () => {
  const codeStore = useCodeStore()

  const budgetYear = computed(() => _.find(codeStore.lists['BUDGET_YEAR'], { isDefault: TRUE }).value)

  return { budgetYear }
})

export default useBusinessStore
