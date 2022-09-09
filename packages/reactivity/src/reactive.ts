import {
  mutableHandlers,
  readonlyHandlers,
  shallowReactiveHandlers,
  shallowReadonlyHandlers,
} from './baseHandlers'

export const reactiveMap = new WeakMap()
export const readonlyMap = new WeakMap()
export const shallowReactiveMap = new WeakMap()
export const shallowReadonlyMap = new WeakMap()

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive', // 标记一个响应式对象
  IS_READONLY = '__v_isReadonly', // 标记一个只读对象
  IS_SHALLOW = '__v_isShallow', // 标记只有一层响应的浅可读写对象
  RAW = '__v_raw', // 标记获取原始值
  // 当前代理对象的源对象，即target
}

export const reactive = (target) => {
  return createReactiveObject(target, reactiveMap, mutableHandlers)
}

export const readonly = (target) => {
  return createReactiveObject(target, readonlyMap, readonlyHandlers)
}

export const shallowReactive = (target) => {
  return createReactiveObject(
    target,
    shallowReactiveMap,
    shallowReactiveHandlers
  )
}

export const shallowReadonly = (target) => {
  return createReactiveObject(
    target,
    shallowReadonlyMap,
    shallowReadonlyHandlers
  )
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

export function isShallow(value) {
  return !!value[ReactiveFlags.IS_SHALLOW]
}
function createReactiveObject(target, proxyMap, baseHandlers) {
  // target被代理过，直接返回
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly(target) && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }
  // 缓存里存在target 直接返回
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  // 核心原理 proxy代理
  const proxy = new Proxy(target, baseHandlers)
  // 缓存代理
  proxyMap.set(target, proxy)

  return proxy
}
