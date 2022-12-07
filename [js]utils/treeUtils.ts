export function getTreeNodeById<T extends { id: U; children?: T[] }, U>(
  tree: T[],
  id: U
): T | null {
  let node: T | null = null
  for (let i = 0, len = tree.length; i < len; i++) {
    const item = tree[i]
    if (item.id === id) {
      node = item
    } else if (item.children) {
      node = getTreeNodeById(item.children, id)
    }
    if (node) {
      break
    }
  }
  return node
}

/**
 * 根据指定的 filter 过滤树节点
 * @param treeData 树节点列表
 * @param filter 过滤器函数，显式返回 true 表示保留
 * @param result 过滤后的树结构
 * @param childrenKey 子节点字段名
 */
export function filterTreeNode<T>(
  treeData: T[] = [],
  filter: (node: T) => boolean | void = () => {},
  result: T[] = [],
  childrenKey: string = 'children'
) {
  treeData.forEach((node) => {
    let keep = false // 是否需要保留
    const tempNode = {
      ...node,
      [childrenKey]: [],
    }
    if (filter(node)) {
      // 有效结点
      keep = true
    }

    // 过滤子节点
    const tempResult = filterTreeNode(node[childrenKey], filter, tempNode[childrenKey], childrenKey)

    if (tempResult.length) {
      // 存在有效子节点，父节点需要保留
      keep = true
    }

    if (keep) {
      // 保留当前节点
      result.push(tempNode)
    }
  })
  return result
}

/**
 * 给树节点注入指定字段的路径
 * @param list 节点列表
 * @param parent 父节点
 * @param fields 注入字段配置，eg：{ key: 'name', map: 'namePath' } // 将节点上的name属性累加到namePath属性上
 * @param childrenKey 子节点字段名
 */
export default function injectTreePath<T>(
  list: T[],
  parent: T,
  fields: { key: string; map: string }[] = [],
  childrenKey: string = 'children',
) {
  (list || []).forEach((node: T) => {
    fields.forEach(({ key, map }) => {
      if (parent) {
        node[map] = [...parent[map], node[key]];
      } else {
        node[map] = [node[key]];
      }
    });
    injectTreePath(node[childrenKey], node, fields, childrenKey);
  });
}
