import type { Column } from 'element-plus'

export const columns = [
  {
    key: 'rowNo',
    dataKey: 'rowNo',
    title: '序号',
    width: 50,
    align: 'center',
    cellRenderer: ({ cellData }) => {
      return <span class="cell">{cellData}</span>
    },
  },
  {
    key: 'shortName',
    dataKey: 'shortName',
    title: '别名',
    width: 200,
    align: 'center',
    cellRenderer: ({ cellData, rowData, column }) => {
      console.log(cellData, rowData, column)
      return <el-input v-model={rowData[column.dataKey]} placeholder="请输入" />
    },
  },
  {
    key: 'code',
    dataKey: 'code',
    title: '编码',
    width: 100,
    align: 'center',
    cellRenderer: ({ cellData }) => {
      return <span class="cell">{cellData}</span>
    },
  },
  {
    key: 'name',
    dataKey: 'name',
    title: '公司名称',
    width: 250,
    align: 'left',
    cellRenderer: ({ cellData }) => {
      return <span class="cell">{cellData}</span>
    },
  },
  {
    key: 'projectName',
    dataKey: 'projectName',
    title: '项目名称',
    width: 300,
    minWidth: 300,
    align: 'left',
    headerClass: 'tc',
    cellRenderer: ({ cellData }) => {
      return <span class="cell">{cellData}</span>
    },
  },
  {
    key: 'applyDate',
    dataKey: 'applyDate',
    title: '申请时间',
    width: 150,
    align: 'center',
    cellRenderer: ({ cellData }) => {
      return <span class="cell">{$filters.dateFormat(cellData, 'YYYY-MM-DD')}</span>
    },
  },
  {
    key: 'remark',
    dataKey: 'remark',
    title: '备注',
    width: 300,
    minWidth: 300,
    align: 'left',
    cellRenderer: ({ cellData }) => {
      return <span class="ellipsis">{cellData}</span>
    },
  },
] as Column[]
