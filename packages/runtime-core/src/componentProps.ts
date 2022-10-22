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
      if (key in propsOptions || key.startsWith('on')) {
        props[key] = value
      } else {
        attrs[key] = value
      }
    }
  }
  instance.props = reactive(props)
  instance.attrs = attrs
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
