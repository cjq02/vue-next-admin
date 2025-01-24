import arrayToTree from 'array-to-tree'

import pathsToTree from '@/utils/libs/pathsToTree'

const TreeUtils = {
  /**
   * 列表转化为树
   *
   * @param array 列表
   * @param options 节点映射
   * */
  listToTree(array, options?) {
    options = Object.assign(
      {
        id: 'id',
        parentId: 'parentId',
      },
      options || {},
    )
    array = _.map(array, (item) => {
      return Object.assign({}, item, {
        id: item[options.id],
        parentId: item[options.parentId],
      })
    })

    return arrayToTree(array, {
      parentProperty: options.parentId,
      customID: options.id,
    })
  },

  /**
   * 列表转化为树
   *
   * @param array 列表
   * @param options 节点属性映射
   * */
  listToSelectTree(array, options?) {
    const { value = 'id', label = 'name', parentId = 'parentId', getDisabled = (item) => false } = options || {}
    array = _.map(array, (item) => {
      return {
        ...item,
        id: item.id,
        value: item[value],
        label: item[label],
        parentId: item[parentId],
        disabled: getDisabled(item),
      }
    })
    return this.listToTree(array)
  },
  /**
   * 获取根节点
   *
   * @param tree 树
   * @param key 节点key
   * @param keyName 节点key名称
   * */
  getRoot(tree, key, keyName = 'id') {
    let root = tree
    if (_.isArray(tree)) {
      if (tree.length === 1) {
        root = tree[0]
      }
      if (tree.length > 1) {
        root = { [keyName]: null, children: tree }
      }
    }
    return root
  },
  /**
   * 根据ID获取该节点
   *
   * @param tree 树
   * @param id 节点ID
   * */
  getNodeById(tree, id) {
    return this.getNodeByKey(tree, id)
  },
  /**
   * 根据key获取该节点
   *
   * @param tree 树
   * @param key 节点key
   * @param keyName 节点key名称
   * */
  getNodeByKey(tree, key, keyName = 'id') {
    const root = this.getRoot(...arguments)
    const getByKey = (tree, key) => {
      let result = null
      if (key === tree[keyName]) {
        return tree
      }
      if (tree.children) {
        tree.children.some((node) => {
          result = getByKey(node, key)
          return result !== null
        })
      }
      return result
    }

    return getByKey(root, key)
  },

  /**
   * 获取节点路径集合
   *
   * @param tree 树
   * @param key 节点key
   * @param keyName 节点key名称
   * */
  getNodePaths(tree, key, keyName = 'id') {
    const root = this.getRoot(...arguments)
    const stack = [[root, [root]]]
    while (stack.length) {
      const [node, path] = stack.pop()
      if (node[keyName] === key) {
        return path
      }
      if (node.children) {
        stack.push(...node.children.map((node) => [node, [...path, node]]))
      }
    }
  },

  /**
   * 传末级节点，获取该节点及其祖宗节点在各层级的索引
   *
   * @param tree 树
   * @param key 节点key
   * @param keyName 节点key名称
   * */
  getTreeLevelIndexes(tree, key, keyName = 'id') {
    const indexes = []

    if (_.isEmpty(tree)) {
      return indexes
    }

    if (_.isEmpty(key)) {
      return indexes
    }

    const getIndexes = (tree, key) => {
      if (_.isNull(key)) {
        return indexes
      }

      const node = this.getNodeByKey(tree, key)
      const parent = this.getNodeByKey(tree, node.parentId)
      indexes.unshift(_.findIndex(parent.children, { [keyName]: node[keyName] }))
      return getIndexes(tree, parent[keyName])
    }
    return getIndexes(tree, key)
  },

  /**
   * tree to list
   * */
  flatten(tree, name) {
    const callback = function (node) {
      return [node, _.flatMapDeep(node[name], callback)]
    }
    return _.flatMapDeep(tree, callback)
  },
  /**
   * 过渡树
   * */
  filter(tree, keyword) {
    const getNodes = (result, node) => {
      if (_.includes(node.label, keyword)) {
        result.push(node)
        return result
      }
      if (Array.isArray(node.children)) {
        const children = node.children.reduce(getNodes, [])
        if (children.length) result.push({ ...node, children })
      }
      return result
    }

    return tree.reduce(getNodes, [])
  },
  /**
   * 路径数组转化为树
   * */
  pathsToTree,
}

export default TreeUtils
