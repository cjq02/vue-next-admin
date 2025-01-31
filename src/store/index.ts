import useAppStore from './app.store'
import useCodeStore from './code.store'
import useMenuStore from './menu.store'
import useTagsViewStore from './tagsView.store'
import useUserStore from './user.store'

const useStore = () => ({
  app: useAppStore(),
  code: useCodeStore(),
  menu: useMenuStore(),
  tagsView: useTagsViewStore(),
  user: useUserStore(),
})

export default useStore
