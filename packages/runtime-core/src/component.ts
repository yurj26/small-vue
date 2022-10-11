import { initProps } from './componentProps'

export function createComponentInstance(vnode, parent) {
  const instance = {
    type: vnode.type,
    vnode,
    next: null, // 需要更新的 vnode，用于更新 component 类型的组件
    props: {},
    parent,
    provides: parent?.provides || {},
    // 获取 parent 的 provides 作为当前组件的初始化值 这样就可以继承 parent.provides 的属性了
    proxy: null,
    isMounted: false,
    attrs: {}, // 存放 attrs 的数据
    slots: {}, // 存放插槽的数据
    ctx: {}, // context 对象
    setupState: {}, // 存储 setup 的返回值
    emit: () => {}
  }

  return instance
}

export function setupComponent(instance) {
  // 处理props
  const { props, children } = instance.vnode

  initProps(instance, props)

  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {}
