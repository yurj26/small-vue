import { isString, isArray, ShapeFlags } from '@small-vue/shared'

export function isVNode(value) {
  return value?.__v_isVNode
}

export function createVNode(type, props, children) {
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0

  const vnode = {
    __v_isVNode: true,
    type,
    props,
    key: props?.key,
    children,
    el: null, //真实节点
    shapeFlag,
  }

  if (children) {
    let type = 0
    if (isArray(children)) {
      type = ShapeFlags.ARRAY_CHILDREN
    } else {
      children = String(children)
      type = ShapeFlags.TEXT_CHILDREN
    }
    vnode.shapeFlag |= type
  }
  return vnode
}
