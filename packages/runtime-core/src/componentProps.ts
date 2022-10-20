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
  instance.props = props
  instance.attrs = attrs
}
