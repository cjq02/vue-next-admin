export default {
  mounted(el, binding) {
    const { value } = binding
    const store = useStore()
    const roles = store.user.roles
    if (value && value instanceof Array && value.length > 0) {
      const roleTypes = value
      const hasRole = roles.some((roleType) => {
        return roleTypes.includes(roleType)
      })

      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-role="[Code.ROLE_TYPE._01]"`)
    }
  },
}
