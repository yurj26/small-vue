import { isObject, hasChanged } from '@small-vue/shared'
import { createDep } from './dep'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { isReactive, reactive } from './reactive'

export class RefImpl {
  public _value: any
  public _rawValue: any
  public dep
  public __v_isRef = true

  constructor(value) {
    this._rawValue = value
    this._value = convert(value)
    this.dep = createDep()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newValue) {
    // 新值老值不一样才触发依赖
    if (hasChanged(newValue, this._rawValue)) {
      this._value = convert(newValue)
      this._rawValue = newValue
      triggerRefValue(this)
    }
  }
}

export function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}

export function triggerRefValue(ref) {
  triggerEffects(ref.dep)
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

function createRef(value) {
  const refImpl = new RefImpl(value)
  return refImpl
}

export function ref(value) {
  return createRef(value)
}

export function isRef(value) {
  return !!value.__v_isRef
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

const shallowUnwrapHandlers = {
  get(target, key, receiver) {
    const result = Reflect.get(target, key, receiver)
    return unRef(result)
  },

  set(target, key, value, receiver) {
    const oldValue = target[key]
    if (isRef(oldValue) && !isRef(value)) {
      return (target[key].value = value)
    } else {
      return Reflect.set(target, key, value, receiver)
    }
  },
}

export function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs)
    ? objectWithRefs
    : new Proxy(objectWithRefs, shallowUnwrapHandlers)
}
