import printJS from 'print-js'

const removeSpecifyColumns = (list, callback) => {
  const tds = _.filter(list, (td, idx) => callback(td))
  if (tds.length > 0) {
    _.each(tds, (td) => td.remove())
  }
}

const getTableDom = (tableEl) => {
  // 获取当前table的dom,必须要用clone，如果不可隆的话会导致你现有表中的表格发生改变
  const tableWrapper = tableEl.cloneNode(true)
  const tableDom = tableWrapper.querySelector('.el-table__header-wrapper table')
  const tbodyDom = tableWrapper.querySelector('.el-table__body tbody')
  const hiddenColumns = tableWrapper.querySelector('.hidden-columns')
  const dataTypeIndex = []
  _.each(hiddenColumns.querySelectorAll('div'), (item, index) => {
    if (item.dataset.type === '1') {
      dataTypeIndex.push(index)
    }
  })
  if (dataTypeIndex.length > 0) {
    _.each(dataTypeIndex, (item, index) => {
      if (tbodyDom.querySelectorAll('tr').length > 0) {
        _.each(tbodyDom.querySelectorAll('tr'), (tr) => {
          tr.querySelectorAll('td')[item].dataset.type = '1'
        })
      }
    })
  }
  tableDom.append(tbodyDom)
  if (tableWrapper.querySelectorAll('.el-table__footer tbody tr').length > 0) {
    const footer = tableWrapper.querySelector('.el-table__footer tbody tr').cloneNode(true)
    _.each(footer.querySelectorAll('td'), (td) => {
      td.rowSpan = 1
      td.colSpan = 1
      td.style.backgroundColor = '#F5F7FA'
    })
    tableDom.querySelector('tbody').append(footer)
  }
  const headers = tableDom.querySelectorAll('th')
  const removeByClsList = _.chain(headers)
    .filter((th) => {
      if (th.querySelector('.el-checkbox') !== null || th.innerText === '操作') {
        return true
      }
    })
    .map((th) => {
      return th.className.split(' ')[0]
    })
    .value()

  // 移除colgroup
  tableDom.querySelector('colgroup').remove()
  // 移除左侧checkbox的节点
  if (headers[0].querySelector('.el-checkbox')) {
    headers[0].remove()
  }
  _.each(tableDom.querySelectorAll('.gutter'), (td) => td.remove())
  _.each(tableDom.querySelectorAll('.el-table__fixed-right-patch'), (td) => td.remove())

  removeSpecifyColumns(headers, (th) => th.innerText === '操作')
  removeSpecifyColumns(headers, (th) => th.style.display === 'none')
  _.each(headers, (th) => {
    th.innerHTML = th.innerText
  })

  const tdList = tableDom.querySelector('tbody').querySelectorAll('td')
  _.each(removeByClsList, (cls) => {
    removeSpecifyColumns(tdList, (td) => td.className.split(' ').includes(cls))
  })
  _.each(tdList, (td) => {
    td.innerHTML = td.innerText
  })
  return tableDom
}

const excelUtils = {
  async exportForm(tableEl, fileName) {
    const htmlContent = tableEl.outerHTML
    await apiUtils.exportExcel(htmlContent, fileName)
  },

  async exportList(tableEl, fileName) {
    const htmlContent = getTableDom(tableEl).outerHTML
    await apiUtils.exportExcel(htmlContent, fileName)
  },

  /**
   * 打印
   * */
  printHTML(tableEl) {
    const htmlContent = getTableDom(tableEl).outerHTML
    // 新建一个 DOM
    const tabDiv = document.createElement('div')
    const printDOMID = 'printDOMElement'
    tabDiv.id = printDOMID
    // 将新的 DIV 添加到页面 打印后再删掉
    document.querySelector('body').appendChild(tabDiv)
    jq('#' + printDOMID).html(htmlContent)
    const tabStyle = `table{width:100%!important;display:table-cell!important;box-sizing:border-box;}
              .el-table__header,.el-table__body,.el-table__footer{width:100%!important;border-collapse: collapse;text-align:center;}
              table,table tr th, table tr td { border:1px solid #ddd;color:#606266;word-wrap:break-word}
              table tr th,table tr td{padding:5px 8px;word-wrap:break-word }
              tr td .cell{width:100%!important}
              table th.gutter{display: none;}
              table colgroup.gutter{display: none;}`
    printJS({
      printable: printDOMID,
      scanStyles: false,
      // 表格样式
      style: tabStyle,

      type: 'html',
    })
    tabDiv.remove()
  },
}

export default excelUtils
