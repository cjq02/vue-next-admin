import * as icons from '@element-plus/icons-vue'

import CountUp from '@/components/CountUp/index.vue'
import D2Container from '@/components/D2Container/index.vue'
import EditableCell from '@/components/EditableCell/index.vue'
import EditableItem from '@/components/EditableItem/index.vue'
import EditTable from '@/components/EditTable/index.vue'
import FormWrapper from '@/components/FormWrapper/index.vue'
import ImageList from '@/components/ImageList/index.vue'
import ImportButton from '@/components/ImportButton/index.vue'
import MultiUpload from '@/components/MultiUpload/index.vue'
import PagingSelect from '@/components/PagingSelect/index.vue'
import TableComb from '@/components/TableComb/index.vue'
import TEditor from '@/components/TEditor/index.vue'
import Timeline from '@/components/Timeline/index.vue'
import TimelineItem from '@/components/Timeline/timeLineItem.vue'
import TooltipOver from '@/components/TooltipOver/index.vue'
import SvgIcon from '@/icons/SvgIcon.vue'

export default {
  install: function (Vue) {
    Vue.component('SvgIcon', SvgIcon)
    Vue.component('PagingSelect', PagingSelect)
    Vue.component('EditableCell', EditableCell)
    Vue.component('EditableItem', EditableItem)
    Vue.component('FormWrapper', FormWrapper)
    Vue.component('ImportButton', ImportButton)
    Vue.component('D2Container', D2Container)
    Vue.component('TableComb', TableComb)
    Vue.component('TEditor', TEditor)
    Vue.component('MultiUpload', MultiUpload)
    Vue.component('EditTable', EditTable)
    Vue.component('TooltipOver', TooltipOver)
    Vue.component('CountUp', CountUp)
    Vue.component('ImageList', ImageList)
    Vue.component('Timeline', Timeline)
    Vue.component('TimelineItem', TimelineItem)

    for (const iconName in icons) {
      Vue.component(iconName, icons[iconName])
    }
  },
}
