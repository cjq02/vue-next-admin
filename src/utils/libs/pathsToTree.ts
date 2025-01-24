export interface TreeNode {
  uuid: string
  label: string
  path: string
  children: TreeNode[]
}

function createNode(paths: string[], tree: TreeNode[]): void {
  const name = paths.shift()
  const idx = tree.findIndex((node: TreeNode) => node.label === name)
  if (idx < 0) {
    // @ts-ignore
    tree.push({
      uuid: $utils.generateUUID(),
      label: name,
      children: [],
    })
    if (paths.length !== 0) {
      createNode(paths, tree[tree.length - 1].children)
    }
  } else {
    if (paths.length !== 0) {
      createNode(paths, tree[idx].children)
    }
  }
}

function buildPath(data, prev = []) {
  return data.reduce((r, { label, children }) => {
    const paths = [...prev, label]
    const node = { label, children, path: paths.join('/') }
    if (children) {
      node.children = buildPath(children, paths)
    }
    r.push(node)
    return r
  }, [])
}

export default function parse(data: string[]): TreeNode[] {
  const tree: TreeNode[] = []
  for (let i = 0; i < data.length; i++) {
    const path: string = data[i]
    const paths: string[] = path.split('/')
    createNode(paths, tree)
  }
  return buildPath(tree)
}
