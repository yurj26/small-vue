export function patchAttr(el, key, nextValue) {
  if (nextValue == null) {
    el.removeAttribute(key)
  } else {
    el.setAttribute(key, nextValue)
  }
}
