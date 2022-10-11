import { isString, isArray, ShapeFlags } from '@small-vue/shared'

export function isVNode(value) {
  return value?.__v_isVNode
}

export function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key
}

// 用 symbol 作为唯一标识
export const Text = Symbol('Text')

export const Fragment = Symbol('Fragment')

export function createVNode(type, props?: any, children?: any) {
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT

  const vnode = {
    __v_isVNode: true,
    type,
    props,
    key: props?.key,
    children,
    el: null, //真实节点
    shapeFlag
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
