// @ts-ignore
import { defineStore } from 'pinia'

import { constantRoutes, default as router } from '@/router'
// @ts-ignore
const modules = import.meta.glob('/src/views/**/*.vue')

const ROOT_PARENT_ID = '1'

const traverseRoutes = function (menus) {
  return menus.map((menu) => {
    if (menu.name) {
      if (menu.component === 'layout') {
        menu.component = () => import('@/layout/index.vue')
      } else {
        if (menu.parentId === ROOT_PARENT_ID) {
          menu.component = () => import('@/layout/index.vue')
          const childMenu = _.extend({}, menu, { parentHidden: true, parentId: '' })
          menu.children = traverseRoutes([childMenu])
        } else {
          menu.component = modules[`/src/views${menu.path}/index.vue`]
          if (!menu.component) {
            menu.component = modules[`/src/views${menu.path}.vue`]
          }
        }
      }
    }

    if (menu.children && menu.children.length) {
      menu.children = traverseRoutes(menu.children)
    }
    return menu
  })
}

const useMenuStore = defineStore('menu', () => {
  const routes = ref<any>([])
  const addRoutes = ref<any>([])

  async function loadSideMenus() {
    const menus = await menuApi.findSideMenuList()
    const remoteRoutes = traverseRoutes(menus)
    setRoutes(remoteRoutes)
    remoteRoutes.forEach((route) => router.addRoute(route))
  }

  function setRoutes(data) {
    addRoutes.value = data
    routes.value = constantRoutes.concat(data)
  }

  return { addRoutes, loadSideMenus, router, routes, setRoutes }
})

export default useMenuStore
