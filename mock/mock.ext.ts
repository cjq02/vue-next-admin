// @ts-ignore
// noinspection SpellCheckingInspection,JSUnusedGlobalSymbols,TypeScriptUnresolvedFunction

import dayjs from 'dayjs'
import _ from 'lodash'
import Mock from 'mockjs'

export function pickOne(list) {
  return Mock.mock({ 'name|1': list }).name
}

export function pickOneInList(list) {
  return pickOne(list)
}

export const getPageInfo = (records) => {
  return {
    pageSize: 10,
    totalRecord: 0,
    currentPage: 1,
    totalPage: 10,
    sort: null,
    records: records,
    condition: {},
    sortBy: '',
    sortType: '',
    recordEnd: 10,
    recordStart: 1,
    recordStartPrev: 0,
  }
}

Mock.Random.extend({
  id() {
    const uuid = Mock.mock('@uuid')
    return uuid.replaceAll('-', '').toLowerCase()
  },
  phone() {
    const phonePrefix = ['132', '135', '189', '150']
    return this.pick(phonePrefix) + Mock.mock(/\d{8}/)
  },
  cityNoSuffix() {
    return Mock.Random.city().replace('市', '').replace('县', '').replace('地区', '').replace('自治州', '')
  },
  gov() {
    const suffix = Mock.mock({ 'name|1': ['地方局', '文化局', '管理局', '办公厅', '文化中心', '服务中心', '委员会'] })
    const middle = Mock.mock({ 'name|1': ['工业', '信息化', '行政', '文化', '发展和改革', '监督'] })
    return Mock.Random.city() + middle.name + suffix.name
  },
  dept() {
    const names = ['仓储', '产品', '人力资源', '财务', '采购', '信息', '生产', '企划', '市场', '行政']
    const middleNames = ['管理', '监督', '技术', '监管', '服务', '规划', '事业', '培训', '', '', '', '']
    const numbers = ['一', '二', '三', '四', '', '', '']
    return pickOneInList(names) + pickOneInList(middleNames) + pickOneInList(numbers) + '部'
  },
  corp() {
    const city = Mock.Random.cityNoSuffix()
    const words =
      '士兰微安辉瑞力思邦明环宇顺精数字智能慧通星中南锋高远创奥斯天合兴联同捷希和百千德光耀博锐时复亚卓迅成克融威丰越芯联虹久'
    const getName = () => {
      const nameLength = pickOneInList([2, 2, 2, 2, 2, 2, 3, 4, 4])
      const names = _.map(_.range(0, nameLength), () => {
        const word = words.charAt(Mock.Random.integer(0, words.length - 1))
        words.replace(word, '')
        return word
      })
      return names.join('')
    }

    const suffix = pickOneInList([
      '科技有限公司',
      '股份有限公司',
      '科技股份有限公司',
      '研究中心',
      '集团',
      '分公司',
      '信息技术有限公司',
      '服务中心',
      '集团股份有限公司',
      '管理咨询有限公司',
    ])
    return city + getName() + suffix
  },
  policy() {
    const prefix = Mock.mock({ 'name|1': ['国务院', '中共中央办公厅', '福建省', Mock.Random.city()] })
    const content = pickOneInList([
      '关于加强新时代离退休干部党的建设工作',
      '创建示范活动管理办法（试行）',
      '国家农业高新技术产业示范区',
      '关于同意建设国家农业高新技术产业示范区',
      '人民满意的公务员集体”推荐评选工作',
      '建设黄河流域生态保护和高质量发展先行区实施方案',
      '对新冠肺炎疫情工作指挥部疫情防控与医疗救治组关于进一步降低新冠病毒检测价格',
      '关于医疗保障局办公室国务院应对新型冠状病毒肺炎疫情联防联控机制医疗救治组关于进一步降低新冠病毒核酸检测和抗原检测价格的',
      '人力资源和社会保障厅税务局关于积极应对疫情影响援企稳岗促就业九条措施',
      '促进工业经济平稳增长行动方案',
      '关于组织开展教育系统新冠肺炎疫情防控专题培训',
      '“五措施”稳供稳产稳工业 全力推进工业经济运行平稳',
      '金融支持常态化疫情防控加快促进经济社会发展若干措施',
      '关于同意在全面深化服务贸易创新发展试点地区暂时调整实施有关行政法规和国务院文件规定',
      '印发《关于加强新时代马克思主义学院建设的意见》',
      '关于阶段性缓缴职工基本医疗保险单位缴费',
      '关于推广疫情防控保险 助力做好保市场主体保就业保民生',
      '关于阶段性加快出口退税办理进度',
      '转发《中央宣传部、中央组织部关于认真组织学习〈习近平谈治国理政〉第四卷》',
      '工业和信息化局关于受理重点发展产业中层以上技术和管理人才贡献奖励申报的',
      '全市工信系统“安全生产月”培训会集中收看《生命重于泰山》电视专题片',
      '圆满完成2022金砖国家工业互联网与数字制造发展论坛通信和网络安全保障工作',
      '召开工信系统青年干部“习近平总书记致厦门经济特区建设40周年贺信重要精神” 大学习、大讨论活动座谈交流会',
    ])
    const suffix = pickOneInList(['的意见', '的有关规定', '的批复', '的通知', '的工作', '的解读', '的最新提醒'])
    return prefix + content + suffix
  },
  project() {
    return pickOneInList([
      pickOneInList(['平潭', '厦门', '大连', '青岛', '东山', '金门']) + '国际赛车嘉年华配套项目',
      Mock.Random.city() + '黄华镇郭家园村一事一议工程项目（试行）',
      '人民医院牙科手机及牙科综合治疗机维保服务项目',
      '华富街道涉疫污水采样及检测服务',
      '政府职工食堂管理服务项目',
      '国家水土保持重点工程贵州习水县九龙囤小流域治理项目',
      '天逸骨灰堂建设项目',
      Mock.Random.corp() + '卷烟物流配送中心技改项目',
      '碧空环保产品有限公司固废、固液除尘器供货项目',
      '大宗物资材料聚氯化铝、聚合硫酸铁、葡萄糖、氯酸钠、碳源补充剂打包采购',
      '王洼煤矿生活区清表、土方移置等工程',
      Mock.Random.city() + '成峰路过村段及非机动车道改造工程施工一标段',
      '物联网及预防管理系统项目',
      '幼保健院关于硬性耳内窥镜项目院内采购',
      '工程学校食堂食材及就餐加工服务采购项目',
      '藏书院第八经济合作社门口田农用地交易',
      '铁路物流基地工程物资采购',
      '国家储备林基地建设项目集约人工林栽培',
      '土地整治项目占补平衡系统报备入库',
      '科幻大会科幻产业新技术新产品展览',
      '医疗机构放射性职业病危害建设项目',
      '危险化学品生产企业安全生产许可安全生产',
      '湿膜新风能源管理项目',
      '国睿再生资源回收有限公司冷库建设项目',
      '达拉特旗展旦召苏木哈吉岱营子至白房子农村公路',
      Mock.Random.cityNoSuffix() + '圣基建材有限公司沥青拌合站迁建项目',
      '全磁悬浮体外人工心脏研发及产业化项目',
      '小石桥乡小石桥村民委员会太阳能路灯维护工程项目',
      '赵立男阿什罕' + Mock.Random.integer(1, 10) * 5 + 'MW分布式光伏项目',
      Mock.Random.city() + '农产品保鲜储存库建设项目',
      Mock.Random.cityNoSuffix() +
        '中钛实业有限公司年产' +
        Mock.Random.integer(1, 10) +
        '万吨海绵钛低碳综合循环生产项目',
      '乌拉特中旗圣龙矿业有限公司铁精粉选矿技改项目',
      '中等职业技术学校教学楼、学生宿舍楼、供电及校道建设工程',
      '巨湾技研储能器件与系统总部及生产基地项目',
      '东亚汽车部件有限公司厂房建设项目',
      '天柱峰粮库粮食质量内部检验检测能力建设项目',
      '亿云进口矿产资源仓储物流基地项目',
      Mock.Random.city() + '高新区横十三路西延道路提升改造工程',
      '省级工业集中区农副产品深加工基地建设项目',
      '哈密市伊吾县盐池镇阿尔通盖村养殖区配套设施建设项目',
      '中国移动江苏公司苏州地区5G700M二期无线主设备工程',
      '破碎粉尘污染治理设施项目',
      '双牌县人民医院核技术利用项目',
      '无人机复合材料产业化项目',
      '智能驾驶传感器研发及生产项目',
      '医用诊断X射线装置应用项目',
      '环保设备改造项目',
      '青龙建昊凉水河乡' + Mock.Random.integer(1, 10) * 5 + 'MW光伏发电项目',
      '酸雾碱雾系统增加二级洗涤系统技术改造项目',
      '华捷木制品除尘治理工程项目',
      Mock.Random.integer(1, 10) * 5 + '万吨/年磷氟系新材料一期项目',
      '秸秆综合利用生物质燃料加工',
      '军民融合强边固防信息化智慧边防项目',
      '生态养殖有限公司牛蛙养殖项目',
      '果园土壤污染治理修复工程',
      '钢渣处理加工线新建除尘项目',
      '废电路板及含铜物料资源综合利用项目',
      '国防公路项目福山区张格庄镇至回里镇公路工程',
      '年产' +
        Mock.Random.integer(1, 10) +
        '万吨' +
        pickOneInList(['铝', '铁', '铜', '镍', '钵']) +
        '锭和' +
        Mock.Random.integer(1, 10) +
        '万吨' +
        pickOneInList(['铝', '铁', '铜', '镍', '钵']) +
        '棒项目',
      '废电路板及含铜物料资源综合利用项目',
      '年加工' + Mock.Random.integer(10, 100) + '万吨高端铝型材智能制造',
      '鸡毛洞种养专业合作社养殖项目',
      '24小时无人值守智能' + pickOneInList(['洗车机', '洗衣机', '售票机', '贩卖机', '便利店']) + '投放',
      '销售、使用安防设备射线装置项目',
      '生活污水官网配套及维修工程',
    ])
  },
  decimal(min, max, precision = 0) {
    return _.round(_.random(min, max), precision)
  },

  assets() {
    const list = [
      '办公桌',
      '电脑',
      '办公椅',
      '电风扇',
      '热水壶',
      '消毒柜',
      '电饭煲',
      '冰柜',
      '托盘',
      '垃圾桶',
      '饮水机',
      '复印机',
      '打印机',
      '打卡机',
      '固定电话机',
      '会议桌',
      '投影仪',
    ]
    return pickOne(list)
  },

  datetime(before = -365, after = 0, date = new Date()) {
    return dayjs(date)
      .add(Mock.mock(`@integer(${before}, ${after})`), 'day')
      .valueOf()
  },

  datetimeRange(start, end) {
    let startDays = -365
    let endDays = 0
    if (!_.isEmpty(start)) {
      startDays = dayjs(start).diff(dayjs(), 'day')
      endDays = dayjs(end).diff(dayjs(), 'day')
    }
    return dayjs()
      .add(Mock.mock(`@integer(${startDays}, ${endDays})`), 'day')
      .valueOf()
  },
})

export default Mock
