import {
  ReactiveFlags,
  reactiveMap,
  reactive,
  readonly,
  readonlyMap,
  shallowReactiveMap,
  shallowReadonlyMap,
} from './reactive'
import { track, trigger } from './effect'
import { isObject, extend } from '@small-vue/shared'

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

const set = createSetter()
const shallowSet = createSetter(true)

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    const IsExistInReactiveMap = () => {
      return key === ReactiveFlags.RAW && receiver === reactiveMap.get(target)
    }

    const IsExistInReadonlyMap = () => {
      return key === ReactiveFlags.RAW && receiver === readonlyMap.get(target)
    }

    const isExistInShallowReactiveMap = () =>
      key === ReactiveFlags.RAW && receiver === shallowReactiveMap.get(target)

    const isExistInShallowReadonlyMap = () =>
      key === ReactiveFlags.RAW && receiver === shallowReadonlyMap.get(target)

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.IS_SHALLOW) {
      return shallow
    } else if (
      IsExistInReactiveMap() ||
      IsExistInReadonlyMap() ||
      isExistInShallowReactiveMap() ||
      isExistInShallowReadonlyMap()
    ) {
      return target
    }

    const result = Reflect.get(target, key, receiver)

    if (!isReadonly) {
      track(target, 'get', key)
    }

    if (shallow) {
      return result
    }

    // 判断内部是否为对象，深度代理
    if (isObject(result)) {
      return isReadonly ? readonly(result) : reactive(result)
    }

    return result
  }
}

function createSetter(shallow = false) {
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

export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet,
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

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})
