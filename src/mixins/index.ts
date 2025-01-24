import commonMixin from '@/mixins/lib/common.mixin.js'
import elementMixin from '@/mixins/lib/element.mixin.js'
import permissionMixin from '@/mixins/lib/permission.mixin.js'
import routerMixin from '@/mixins/lib/router.mixin.js'

export default function (app) {
  app.mixin(elementMixin)
  app.mixin(commonMixin)
  app.mixin(routerMixin)
  app.mixin(permissionMixin)
}
