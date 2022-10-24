import {
  LifecycleHooks,
  currentInstance,
  setCurrentInstance
} from './component'

function createHook(type) {
  return function (hook, target = currentInstance) {
    return injectHook(type, hook, target)
  }
}

function injectHook(type, hook, target) {
  if (target) {
    const hooks = target[type] || (target[type] = [])

    const wrappedHook = () => {
      setCurrentInstance(target)

      hook.call(target)

      setCurrentInstance(null)
    }

    hooks.push(wrappedHook)
  }
}

export const onBeforeMount = createHook(LifecycleHooks.BEFORE_MOUNT)
export const onMounted = createHook(LifecycleHooks.MOUNTED)
export const onBeforeUpdate = createHook(LifecycleHooks.BEFORE_UPDATE)
export const onUpdated = createHook(LifecycleHooks.UPDATED)
export const onBeforeUnmount = createHook(LifecycleHooks.BEFORE_UNMOUNT)
export const onUnmounted = createHook(LifecycleHooks.UNMOUNTED)
export const onServerPrefetch = createHook(LifecycleHooks.SERVER_PREFETCH)
