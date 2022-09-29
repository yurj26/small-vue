function createInvoker(fn) {
  const invoker = (e) => invoker.value(e)
  invoker.value = fn
  return invoker
}

export function patchEvent(el, eventName, nextValue) {
  // 缓存事件
  const invokers = el._vei || (el._vei = {})
  const exisitingInvoker = invokers[eventName]

  if (nextValue && exisitingInvoker) {
    // update
    exisitingInvoker.value = nextValue
  } else {
    // 转化事件名为小写的  onClick 要变成 click
    const name = eventName.slice(2).toLowerCase()
    if (nextValue) {
      // add
      const invoker = (invokers[eventName] = createInvoker(nextValue))
      el.addEventListener(name, invoker)
    } else if (exisitingInvoker) {
      // remove
      el.removeEventListener(name, exisitingInvoker)
      invokers[eventName] = undefined
    }
  }
}
