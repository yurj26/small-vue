import { ReactiveFlags, reactiveMap, reactive } from './reactive'
import { track, trigger } from './effect'
import { isObject } from '@small-vue/shared'

const get = createGetter()
const set = createSetter()

function createGetter() {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }

    const result = Reflect.get(target, key, receiver)

    track(target, 'get', key)

    // 判断内部是否为对象，深度代理
    if (isObject(result)) {
      return reactive(result)
    }

    return result
  }
}

function createSetter() {
  return function set(target, key, value, receiver) {
    let oldValue = target[key]
    const result = Reflect.set(target, key, value, receiver)

    // 避免重复收集
    if (oldValue !== value) {
      trigger(target, 'set', key)
    }

    return result
  }
}
export const mutableHandlers = {
  get,
  set,
}
