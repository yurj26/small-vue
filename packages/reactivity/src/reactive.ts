import { isObject } from '@small-vue/shared'
const reactiveMap = new WeakMap()
const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}
export const reactive = (target) => {
  if (!isObject(target)) {
    return
  }

  if (reactiveMap.has(target)) {
    return reactiveMap.get(target)
  }

  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === ReactiveFlags.IS_REACTIVE) {
        return true
      }

      const result = Reflect.get(target, key, receiver)
      return result
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      return result
    },
  })
  reactiveMap.set(target, proxy)
  return proxy
}
