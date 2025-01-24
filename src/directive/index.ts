import NumericDirective from '@/directive/numeric'
import permission from '@/directive/permission'
import role from '@/directive/role'

export default function (app) {
  /* app.directive('permission', permission)*/
  app.directive('role', role)
  app.directive('permission', permission)
  app.use(NumericDirective)
}
