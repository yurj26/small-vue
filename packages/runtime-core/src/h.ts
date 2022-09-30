import { isObject, isArray } from '@small-vue/shared'
import { createVNode, isVNode } from './vnode'

/*
h函数支持多种传参
h('div')
h('div', {style:{"color": "red"}})
h('div', {style:{"color": "red"}}, 'hello')
h('div', 'hello')
h('div', null, 'hello', 'world')
h('div', null, h('span'))
h('div', null, [h('span')])
*/

export function h(type, propsOrChildren?, children?) {
  const l = arguments.length
  // 只有属性，或者只有一个元素儿子
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      // h('div', h('span'))
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren])
      }
      // h('div', { style: { color: 'red' } })
      return createVNode(type, propsOrChildren)
    } else {
      // h('div', 'hello')
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    if (l > 3) {
      // h('div', null, h('span'), h('span')....)
      children = Array.prototype.slice.call(arguments, 2)
    } else if (l === 3 && isVNode(children)) {
      // h('div', null, h('span'))
      children = [children]
    }
    return createVNode(type, propsOrChildren, children)
  }
}
