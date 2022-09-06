export let activeEffect = undefined
const targetMap = new WeakMap()

class ReactiveEffect {
  public parent = null
  public deps = []
  public active = true
  constructor(public fn) {}
  run() {
    if (!this.active) return this.fn()

    try {
      // 收集依赖
      this.parent = activeEffect as any
      activeEffect = this as any

      return this.fn()
    } finally {
      // 重置
      activeEffect = this.parent as any
    }
  }
  stop() {
    if (this.active) {
      this.active = false
    }
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
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
  console.log('收集依赖', target, type, key)
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  // 第一次没有
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  dep.add(activeEffect)
}
// 触发依赖
export function trigger(target, type, key) {
  console.log('触发依赖', target, type, key)
  // let deps: Array<any> = []

  const depsMap = targetMap.get(target)
  if (!depsMap) return

  let effects = depsMap.get(key)
  if (effects) {
    effects.forEach((effect) => {
      // 避免effect重复执行产生递归
      if (effect !== activeEffect) {
        effect.run()
      }
    })
  }
}
