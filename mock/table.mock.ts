// noinspection SpellCheckingInspection

import Mock from './mock.ext'

const data = Mock.mock({
  'items|10000': [
    {
      id: '@id',
      code: '@integer(10000, 99999)',
      name: '@corp',
      shortName: '@cname',
      projectName: '@project',
      remark: '@csentence(10, 200)',
      'status|1': ['published', 'draft', 'deleted'],
      author: 'name',
      applyDate: '@datetime',
      'totalAmt|100-100000.0-2': 0,
    },
  ],
})
export default [
  {
    url: `/${process.env.VITE_APP_BASE_API}/test/getPage.json`,
    method: 'post',
    response: () => {
      return {
        pageSize: 10,
        totalRecord: 2,
        currentPage: 1,
        totalPage: 10,
        sort: null,
        records: data.items.slice(0, 20),
        condition: {},
        sortBy: '',
        sortType: '',
        recordEnd: 10,
        recordStart: 1,
        recordStartPrev: 0,
      }
    },
  },
  {
    url: `/${process.env.VITE_APP_BASE_API}/test/getList.json`,
    method: 'post',
    response: () => {
      return data.items
    },
  },
]
