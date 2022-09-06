import { ReactiveFlags, reactiveMap, reactive } from './reactive'
import { isObject } from '@small-vue/shared'

const get = createGetter()
const set = createSetter()

function createGetter() {
  return function get(target, key, receiver) {
    console.log(key, ReactiveFlags.IS_REACTIVE)

    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }

    const isExistInReactiveMap = receiver === reactiveMap.get(target)

    if (isExistInReactiveMap) {
      return target
    }

    const result = Reflect.get(target, key, receiver)
    // 判断内部是否为对象，深度代理
    if (isObject(result)) {
      return reactive(result)
    }
    return result
  }
}

function createSetter() {
  return function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    return result
  }
}
export const mutableHandlers = {
  get,
  set,
}
