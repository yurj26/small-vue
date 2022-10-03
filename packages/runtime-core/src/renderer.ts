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

    mountElement(n2, container, anchor)
  }

  function mountElement(vnode, container, anchor) {
    const { type, props, children, shapeFlag } = vnode
    const el = (vnode.el = hostCreateElement(type))

    hostSetElementText(el, children)

    if (props) {
      for (let key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }

    hostInsert(el, container)
  }

  return {
    render,
  }
}
