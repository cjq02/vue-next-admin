import 'nprogress/nprogress.css'

import nProgress from 'nprogress'

import useUserStore from '@/store/user.store'

import router from './router'
// NProgress Configuration
nProgress.configure({ showSpinner: false })

// no redirect whitelist
const whiteList = ['/login']

$utils.auth.loadFingerPrint().then()

/* console.log('router', router);*/
router.beforeEach(async (to) => {
  // start progress bar
  nProgress.start()
  const userStore = useUserStore()
  const menuStore = useMenuStore()
  const codeStore = useCodeStore()
  const appStore = useAppStore()
  // @ts-ignore
  document.title = to.meta.title || appStore.settings.title

  // determine whether the user has logged in
  const token = $utils.auth.getToken()
  /* console.log('token',  token);*/

  if (token) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      nProgress.done()
      return '/'
    }
    const hasRoles = userStore.roles && userStore.roles.length > 0
    if (hasRoles) {
      return true
    }
    try {
      // get user info
      await userStore.loadUserInfo()
      await codeStore.loadCodeMap()
      await menuStore.loadSideMenus()
      return '/redirect' + to.fullPath
    } catch (error) {
      console.log('auth error', error)
      // remove token and go to login page to re-login
      userStore.resetToken()
      /* Message.error(error || 'Has Error');*/
      nProgress.done()
      return `/login`
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      return true
    }
    nProgress.done()
    return `/login`
  }
})

router.afterEach((to, from) => {
  // finish progress bar
  nProgress.done()
})
