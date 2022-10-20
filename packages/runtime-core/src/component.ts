import { reactive } from '@small-vue/reactivity'
import { hasOwn, isFunction } from '@small-vue/shared'
import { initProps } from './componentProps'

export function createComponentInstance(vnode, parent) {
  const instance = {
    data: null,
    type: vnode.type,
    vnode,
    next: null, // 需要更新的 vnode，用于更新 component 类型的组件
    propsOptions: vnode.type.props,
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

  return instance
}

const publicPropertyMap = {
  $attrs: i => i.attrs
}

const PublicInstanceProxyHandlers = {
  get(target, key) {
    const { data, props } = target
    if (data && hasOwn(data, key)) {
      return data[key]
    } else if (props && hasOwn(props, key)) {
      return props[key]
    }
    // this.$attrs
    const getter = publicPropertyMap[key]
    return getter(target)
  },
  set(target, key, value) {
    const { data, props } = target
    if (data && hasOwn(data, key)) {
      data[key] = value
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
  // 处理props
  const { props, type } = instance.vnode

  initProps(instance, props)

  instance.proxy = new Proxy(instance, PublicInstanceProxyHandlers)

  let data = type.data
  if (data) {
    if (!isFunction(data)) {
      // vue3中，dat必须为函数
      return console.warn('data option must be a function')
    }
    instance.data = reactive(data.call(instance.proxy))
  }

  instance.render = type.render
}
