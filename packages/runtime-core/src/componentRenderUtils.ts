export function shouldUpdateComponent(n1, n2) {
  const { props: prevProps, children: prevChildren } = n1
  const { props: nextProps, children: nextChildren } = n2

  if (prevProps === nextProps) {
    return false
  }
  if (!prevProps) {
    return !!nextProps
  }
  if (!nextProps) {
    return true
  }
  // 插槽需要更新
  if (prevChildren || nextChildren) {
    return true
  }
  return hasPropsChanged(prevProps, nextProps)
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
