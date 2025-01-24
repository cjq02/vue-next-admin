import * as fileApi from '@/api/file/file.api'
import * as fileManageApi from '@/api/file/fileManage.api'
/* import * as homeApi from '@/api/home.api'*/
import * as loginApi from '@/api/login.api'
import * as announceApi from '@/api/sys/announce.api.js'
import * as codeApi from '@/api/sys/code.api'
import * as corpApi from '@/api/sys/corp.api'
import * as deptApi from '@/api/sys/dept.api'
import * as menuApi from '@/api/sys/menu.api'
import * as roleApi from '@/api/sys/role.api'
import * as userApi from '@/api/sys/user.api'

export default {
  /* homeApi,*/
  file: {
    fileApi,
    fileManageApi,
  },

  loginApi,
  sys: {
    announceApi,
    codeApi,
    corpApi,
    deptApi,
    menuApi,
    roleApi,
    userApi,
  },
}
