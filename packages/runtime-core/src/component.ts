import { proxyRefs, reactive } from '@small-vue/reactivity'
import { hasOwn, isFunction } from '@small-vue/shared'
import { initProps } from './componentProps'
import { emit } from './componentEmits'
import { initSlots } from './componentSlots'

export function createComponentInstance(vnode, parent) {
  const instance = {
    data: null,
    type: vnode.type,
    vnode,
    next: null, // 需要更新的 vnode，用于更新 component 类型的组件
    propsOptions: vnode.type.props || {},
    props: {},
    attrs: {}, // 存放 attrs 的数据
    parent,
    provides: parent?.provides || {},
    // 获取 parent 的 provides 作为当前组件的初始化值 这样就可以继承 parent.provides 的属性了
    proxy: null,
    isMounted: false,
    slots: {}, // 存放插槽的数据
    ctx: {}, // context 对象
    setupState: {}, // 存储 setup 的返回值
    emit: () => {}
  }

  instance.emit = emit.bind(null, instance) as any

  return instance
}

const publicPropertyMap = {
  $attrs: i => i.attrs,
  $slots: i => i.slots
}

const PublicInstanceProxyHandlers = {
  get(target, key) {
    const { data, props, setupState } = target
    if (data && hasOwn(data, key)) {
      return data[key]
    } else if (setupState && hasOwn(setupState, key)) {
      return setupState[key]
    } else if (props && hasOwn(props, key)) {
      return props[key]
    }
    // this.$attrs this.$slots
    const getter = publicPropertyMap[key]
    return getter(target)
  },
  set(target, key, value) {
    const { data, props, setupState } = target
    if (data && hasOwn(data, key)) {
      data[key] = value
      return true
    } else if (setupState && hasOwn(setupState, key)) {
      setupState[key] = value
      return true
    } else if (props && hasOwn(props, key)) {
      // props不允许修改
      console.warn('attempting to mutate prop ' + String(key))
      return false
    }
    return true
  }
}

export function setupComponent(instance) {
  const { props, type: Component, children } = instance.vnode
  // 处理props
  initProps(instance, props)
  // 处理插槽
  initSlots(instance, children)
  // 创建渲染上下文对象，porxy
  instance.proxy = new Proxy(instance, PublicInstanceProxyHandlers)

  const { setup } = Component

  if (setup) {
    const setupContext = createSetupContext(instance)
    const setupResult = setup && setup(instance.props, setupContext)
    if (isFunction(setupResult)) {
      // 返回值是渲染函数
      instance.render = setupResult
    } else {
      // 解构ref
      instance.setupState = proxyRefs(setupResult)
    }
  }

  const { data } = Component
  if (data) {
    if (!isFunction(data)) {
      // vue3中，dat必须为函数
      return console.warn('data option must be a function')
    }
    instance.data = reactive(data.call(instance.proxy))
  }

  if (!instance.render) {
    instance.render = Component.render
  }
}

function createSetupContext(instance) {
  return {
    attrs: instance.attrs,
    slots: instance.slots,
    emit: instance.emit,
    expose: () => {}
  }
}
