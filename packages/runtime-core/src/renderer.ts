import { ShapeFlags } from '@small-vue/shared'
import { Text } from './vnode'
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
    patch(null, vnode, container)
  }

  function patch(n1, n2, container = null, anchor = null) {
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

  function updateElement(n1, n2, container, abc) {}

  function mountChildren(children, container) {
    // 递归子元素 创建
    children.forEach(VNodeChild => {
      patch(null, VNodeChild, container)
    })
  }

  function processText(n1, n2, container) {
    // 文本元素节点的创建和更新
    if (n1 === null) {
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
      updateElement(n1, n2, container, anchor)
    }
  }

  return {
    render
  }
}
