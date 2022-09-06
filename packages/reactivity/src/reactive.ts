import { mutableHandlers } from './baseHandlers'

export const reactiveMap = new WeakMap()

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}

export const reactive = (target) => {
  return createReactiveObject(target, reactiveMap, mutableHandlers)
}

export function isProxy(value) {
  return isReactive(value)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

function createReactiveObject(target, proxyMap, baseHandlers) {
  // target被代理过 直接返回
  if (isProxy(target)) {
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
