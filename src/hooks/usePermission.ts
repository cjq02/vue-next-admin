import { useRoute } from 'vue-router'

export const usePermission = function () {
  const store = useStore()
  const route = useRoute()

  function checkRole(roles) {
    return store.user.roles.some((role) => {
      return roles.includes(role)
    })
  }

  function checkPermission(permissions) {
    const permissionCodes = _.map(permissions, (permission) => `${route.name!.toString()}:${permission}`)
    return store.user.permissions.some((permission) => {
      return permissionCodes.includes(permission)
    })
  }

  return {
    checkRole,
    checkPermission,
  }
}
