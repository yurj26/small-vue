import { createDep } from './dep'
import { ReactiveEffect } from './effect'
import { triggerRefValue, trackRefValue } from './ref'
class ComputedRefIml {
  public dep: any
  public effect: ReactiveEffect

  private _dirty: Boolean
  private _value
  constructor(getter) {
    this._dirty = true
    this.dep = createDep()
    this.effect = new ReactiveEffect(getter, () => {
      if (this._dirty) return

      this._dirty = true
      triggerRefValue(this)
    })
  }

  get value() {
    trackRefValue(this)

    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }
}

export function computed(getter) {
  return new ComputedRefIml(getter)
}
