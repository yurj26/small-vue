import { hasOwn } from '@small-vue/shared'

const publicPropertiesMap = {
  $attrs: i => i.attrs,
  $slots: i => i.slots,
  $props: i => i.props,
  $el: i => i.el
}

export const PublicInstanceProxyHandlers = {
  get(target, key) {
    const { data, props, setupState } = target
    if (key[0] !== '$') {
      if (data && hasOwn(data, key)) {
        return data[key]
      } else if (setupState && hasOwn(setupState, key)) {
        return setupState[key]
      } else if (props && hasOwn(props, key)) {
        return props[key]
      }
    }
    const publicGetter = publicPropertiesMap[key]
    return publicGetter(target)
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
