import router from '@/router'

export default {
  mounted(el, binding) {
    const { value } = binding
    const route: any = router.currentRoute.value
    const store = useStore()
    const permissions = store.user.permissions
    if (value && value instanceof Array && value.length > 0) {
      const permissionCodes = _.map(value, (item) => `${route.name}:${item}`)
      const hasPermission = permissions.some((permission) => {
        return permissionCodes.includes(permission)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need permissions! Like v-permission="['edit']"`)
    }
  },
}
