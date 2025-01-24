const permissionMixin = {
  methods: {
    checkRole(roles) {
      return this.userStore.roles.some((role) => {
        return roles.includes(role)
      })
    },
    checkPermission(permissions) {
      const permissionCodes = _.map(permissions, (permission) => `${this.$route.name}:${permission}`)
      return this.userStore.permissions.some((permission) => {
        return permissionCodes.includes(permission)
      })
    },
  },
}

export default permissionMixin
