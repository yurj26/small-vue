import {
  ReactiveFlags,
  reactiveMap,
  reactive,
  readonly,
  readonlyMap,
} from './reactive'
import { track, trigger } from './effect'
import { isObject } from '@small-vue/shared'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadonly = false) {
  return function get(target, key, receiver) {
    const IsExistInReactiveMap = () => {
      return key === ReactiveFlags.RAW && receiver === reactiveMap.get(target)
    }

    const IsExistInReadonlyMap = () => {
      return key === ReactiveFlags.RAW && receiver === readonlyMap.get(target)
    }

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (IsExistInReactiveMap() || IsExistInReadonlyMap()) {
      return target
    }

    const result = Reflect.get(target, key, receiver)

    if (!isReadonly) {
      track(target, 'get', key)
    }

    // 判断内部是否为对象，深度代理
    if (isObject(result)) {
      return isReadonly ? readonly(result) : reactive(result)
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
export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    // readonly 的响应式对象不可以修改值
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    )
    return true
  },
  deleteProperty(target, key) {
    console.warn(
      `Delete operation on key "${String(key)}" failed: target is readonly.`,
      target
    )
    return true
  },
}
