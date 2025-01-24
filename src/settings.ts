/**
 * @type {boolean} true | false
 * @description Whether show the drop-down
 */
export const showDropdown = true

/**
 * 端口
 * */
export const port = 10102

/**
 * @type {boolean} true | false
 * @description Whether show Hamburger
 */
export const showHamburger = true

/**
 * @type {boolean} true | false
 * @description Whether show the settings right-panel
 */
export const showLeftMenu = true

/* page login or other*/
/**
 * @type {boolean} true | false
 * @description Whether need login
 */
export const isNeedLogin = true

/**
 * @type {boolean} true | false
 * @description Whether show the logo in sidebar
 */
export const sidebarLogo = true

/*
 * table height(100vh-delWindowHeight)
 * */
export const delWindowHeight = '210px'

/* page layout related*/
// sideBar or navbar show title
export const title = 'Admin System'

/**
 * @type {boolean} true | false
 * @description Whether show the title in Navbar
 */
export const showNavbarTitle = false

/**
 * @type {string | array} 'dev' | ['prod','test','dev'] according to the .env file props of VITE_APP_ENV
 * @description Need show err logs component.
 * The default is only used in the production env
 * If you want to also use it in dev, you can pass ['build', 'serve']
 */
export const errorLog = ['prod']

/**
 * @type {boolean} true | false
 * @description Whether show TagsView
 */
export const showTagsView = true

/**
 * 固定头部
 * */
export const fixedHeader = true

/**
 * @type {boolean} true | false
 * @description Whether show the top Navbar
 */
export const showTopNavbar = true

/**
 * @description TagsView show number
 */
export const tagsViewNum = 6

/* page  animation related*/
/**
 * @type {boolean} true | false
 * @description Whether need animation of main area
 */
export const mainNeedAnimation = true

/**
 * @type {boolean} true | false
 * @description Whether  open prod mock
 */
export const openProdMock = true
/**
 * @type {string} 'roles' | 'code'
 */
export const permissionMode = 'roles'

/*
 * setting dev token when  isNeedLogin is setting false
 * */
export const tmpToken = 'tmp_token'
