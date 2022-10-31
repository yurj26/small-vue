import { isArray, isString } from '@small-vue/shared'

export function patchStyle(el, prev, next) {
  const style = el.style
  const isCssString = isString(next)

  if (next && !isCssString) {
    for (let key in next) {
      setStyle(style, key, next[key])
    }
    if (prev) {
      for (let key in prev) {
        if (next[key] == null) {
          setStyle(style, key, '')
        }
      }
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next as string
      }
    } else if (prev) {
      el.removeAttribute('style')
    }
  }
}
const importantRE = /\s*!important$/

function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach(v => setStyle(style, name, v))
  } else {
    if (val == null) val = ''
    if (name.startsWith('--')) {
      // custom property definition
      style.setProperty(name, val)
    } else {
      if (importantRE.test(val)) {
        // !important
        style.setProperty(name, val.replace(importantRE, ''), 'important')
      } else {
        style[name] = val
      }
    }
  }
}
