import { hasOwn } from '@small-vue/shared'
import { reactive } from '@small-vue/reactivity'

export function initProps(instance, rawProps) {
  // rawProps: 用户传入的
  const props = {}
  const attrs = {}

  const { propsOptions } = instance
  if (rawProps) {
    for (let key in rawProps) {
      let value = rawProps[key]
      if (key in propsOptions) {
        props[key] = value
      } else {
        attrs[key] = value
      }
    }
  }
  instance.props = reactive(props)
  instance.attrs = attrs
}

export const hasPropsChanged = (prevProps, nextProps) => {
  const nextKeys = Object.keys(nextProps)
  // 比对个数
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true
  }
  // 比对value
  for (let i = 0; i < nextKeys.length; i++) {
    let key = nextKeys[i]
    if (nextProps[key] !== prevProps[key]) {
      return true
    }
  }
  return false
}

export function updateProps(prevProps, nextProps) {
  for (let key in nextProps) {
    prevProps[key] = nextProps[key]
  }

  for (let key in prevProps) {
    if (!hasOwn(prevProps, key)) {
      delete prevProps[key]
    }
  }
}
