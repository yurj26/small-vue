export function patchStyle(el, prev, next) {
  const style = el.style

  if (next) {
    for (let key in next) {
      style[key] = next[key]
    }
    if (prev) {
      for (let key in prev) {
        if (next[key] == null) {
          style[key] = null
        }
      }
    }
  } else {
    el.removeAttribute('style')
  }
}
