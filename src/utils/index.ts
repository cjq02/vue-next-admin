import * as auth from '@/utils/auth'
import emitter from '@/utils/bus'
import * as commonUtils from '@/utils/common.utils'
import excelUtils from '@/utils/excel.utils'
import messageUtils from '@/utils/message.utils'
import numberUtils from '@/utils/number.utils'
import treeUtils from '@/utils/tree.utils'

export default {
  ...commonUtils,
  emitter,
  auth,
  excelUtils,
  messageUtils,
  treeUtils,
  numberUtils,
}
