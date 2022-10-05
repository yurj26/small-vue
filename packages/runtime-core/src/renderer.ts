import { ShapeFlags } from '@small-vue/shared'
export const createRenderer = (renderOptions) => {
  const {
    createElement: hostCreateElement,
    setElementText: hostSetElementText,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setText: hostSetText,
    createText: hostCreateText,
  } = renderOptions

  const render = (vnode, container) => {
    console.log(vnode, container)
    patch(null, vnode, container)
  }

  function patch(n1, n2, container = null, anchor = null) {
    // 渲染核心逻辑
    const { type, ShapeFlag } = n2

    switch (type) {
      case Text:
        processText(n1, n2, container)
    }

    mountElement(n2, container, anchor)
  }

  function mountElement(vnode, container, anchor) {
    const { type, props, children, shapeFlag } = vnode
    const el = (vnode.el = hostCreateElement(type))

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children)
    } else {
      mountChildren(children, el)
    }

    if (props) {
      for (let key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }

    hostInsert(el, container)
  }

  function mountChildren(children, container) {
    children.forEach((VNodeChild) => {
      patch(null, VNodeChild, container)
    })
  }

  function processText(n1, n2, container) {
    if (n1 === null) {
      hostInsert((n2.el = hostCreateElement(n2.children)), container)
    } else {
    }
  }

  return {
    render,
  }
}
