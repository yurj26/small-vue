import { createDep } from './dep'
import { extend } from '@small-vue/shared'
export let activeEffect = undefined
const targetMap = new WeakMap()

class ReactiveEffect {
  public parent = null
  public deps = []
  public active = true
  public onStop?: () => void
  constructor(public fn) {}
  run() {
    if (!this.active) return this.fn()

    try {
      // 收集依赖
      this.parent = activeEffect as any
      activeEffect = this as any

      cleanupEffect(this)

      return this.fn()
    } finally {
      // 重置
      activeEffect = this.parent as any
    }
  }
  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

export function stop(runner) {
  runner.effect.stop()
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn)
  extend(_effect, options)
  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}
/*
  收集依赖
  targetMap = new Map(target-> key->new Map(key-> new Set(activeEffect)))
  {
    obj: { //depsMap
      key:  new Set(activeEffect) //dep
    }
  }
*/
export function track(target, type, key) {
  // console.log('收集依赖', target, type, key)
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  // 第一次没有
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = createDep()
    depsMap.set(key, dep)
  }
  trackEffects(dep)
}
function trackEffects(dep) {
  dep.add(activeEffect)
  ;(activeEffect as any).deps.push(dep)
}
// 触发依赖
export function trigger(target, type, key) {
  // console.log('触发依赖', target, type, key)
  let deps: Array<any> = []

  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep = depsMap.get(key)
  deps.push(dep)

  let effects: Array<any> = []
  deps.forEach((dep) => {
    // 解构出来为effect
    effects.push(...dep)
  })
  triggerEffects(createDep(effects))
}
function triggerEffects(dep) {
  dep.forEach((effect) => {
    // 避免effect重复执行产生递归
    if (effect !== activeEffect) {
      effect.run()
    }
  })
}
