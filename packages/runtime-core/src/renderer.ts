import { ShapeFlags } from '@small-vue/shared'
import { isSameVNodeType, Text } from './vnode'
export const createRenderer = renderOptions => {
  const {
    createElement: hostCreateElement,
    setElementText: hostSetElementText,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setText: hostSetText,
    createText: hostCreateText
  } = renderOptions

  const render = (vnode, container) => {
    console.log('调用 patch')
    if (vnode == null) {
      // 卸载节点
      if (container._vnode) {
        // unmount()
      }
    } else {
      patch(container._vnode || null, vnode, container)
    }
    container._vnode = vnode
  }

  function patch(n1, n2, container = null, anchor = null) {
    if (n1 === n2) {
      return
    }
    // 如果vnode不是同一类型，卸载老节点
    if (n1 && !isSameVNodeType(n1, n2)) {
      console.log('!isSameVNodeType')
      // unmount()
      n1 = null
    }
    // 渲染核心逻辑
    const { type, shapeFlag } = n2

    switch (type) {
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor)
        }
    }
  }

  function mountElement(vnode, container, anchor) {
    const { type, props, children, shapeFlag } = vnode
    const el = (vnode.el = hostCreateElement(type))

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // h('h1', {}, 'text')
      hostSetElementText(el, children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // h('h1', {}, [h(), h()])
      // 递归处理数组元素
      mountChildren(children, el)
    }

    if (props) {
      for (let key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }

    hostInsert(el, container)
  }

  function patchElement(n1, n2, container, anchor) {
    console.log('oldVNode', n1)
    console.log('newVNode', n2)

    const oldProps = n1?.props || {}
    const newProps = n2?.props || {}

    // 需要把 el 挂载到新的 vnode
    const el = (n2.el = n1.el)
    // 比对属性
    patchProps(el, oldProps, newProps)
    // 比对children
    patchChildren(n1, n2, el, anchor)
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      // { id: 1 } -> { id: 2 }
      for (let key in newProps) {
        const next = newProps[key]
        const pre = oldProps[key]
        if (next !== pre) {
          hostPatchProp(el, key, pre, next)
        }
      }
      // { id: 1, uId: 2} -> { id: 1 }
      if (oldProps) {
        for (let key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
  }

  function patchChildren(n1, n2, container, anchor) {
    const { shapeFlag: prevShapeFlag, children: c1 } = n1
    const { shapeFlag, children: c2 } = n2
    // children type: array | text | null
    // prev      new
    // array     array
    // text  ->  text
    // null      null

    // array -> text 删除元素，设置文本内容
    // text -> text  更新文本
    // null -> text  更新文本

    // array -> array diff算法，比较元素
    // text -> array  清空文本，进行挂载
    // null -> array  进行挂载

    // array -> null 删除元素
    // text -> null  清空文本
    // null -> null  无处理

    // array | text -> text
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // prev children: array
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // unmountChildren()
        console.log('array -> text')
      }
      if (c1 !== c2) {
        console.log('text -> text')
        hostSetElementText(container, c2)
      }
    } else {
      // prev children: array
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // array -> array  diff
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          console.log('array -> array')
          // patchKeyedChildren()
        } else {
          // array -> null
          console.log('array -> null')
          // unmountChildren()
        }
      } else {
        //prev children: text

        // text -> array | null
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          console.log('text -> null')
          hostSetElementText(container, '')
        }

        // text -> array
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          console.log('text -> array')
          mountChildren(c2, container)
        }
      }
    }
  }

  function mountChildren(children, container) {
    // 递归子元素 创建
    children.forEach(VNodeChild => {
      patch(null, VNodeChild, container)
    })
  }

  function processText(n1, n2, container) {
    // 文本元素节点的创建和更新
    if (n1 == null) {
      hostInsert((n2.el = hostCreateText(n2.children)), container)
    } else {
      const el = (n2.el = n1.el)
      if (n1.children !== n2.children) {
        hostSetText(el, n2.children)
      }
    }
  }

  function processElement(n1, n2, container, anchor) {
    if (!n1) {
      // 创建节点
      mountElement(n2, container, anchor)
    } else {
      // 更新节点
      patchElement(n1, n2, container, anchor)
    }
  }

  return {
    render
  }
}
