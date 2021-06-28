function getLinkedList(n) {
  let headNode = { value: 1, next: null }
  let tempNode = headNode
  for (let i = 2; i <= n; i++) {
    tempNode.next = { value: i, next: null }
    tempNode = tempNode.next
  }
  return headNode
}

var headNode = getLinkedList(10)
console.log(headNode)

function reverse(headNode) {
  let tailNode

  // 一个临时节点，表示尾节点的前一节点，初始为 headNode
  let preNode = headNode

  do {
    // 使 headNode 总是指向已知的最后一个节点
    // 在下一循环中即可取得该节点
    // 即每个循环中该节点都相当于单向链的尾节点
    tailNode = headNode.next

    // 将头节点指向已知尾节点的下一个节点
    // 在下一循环中将作为新的尾节点
    headNode.next = tailNode.next

    // 重置当前已知尾节点的下一节点为前一节点，实现反转
    tailNode.next = preNode

    // 重新赋值，指向已知尾节点
    // 在下一循环中将作为 tailNode 的前一节点
    preNode = tailNode
  } while (headNode.next !== null)
  return tailNode
}

var tailNode = reverse(headNode)
console.log(tailNode)