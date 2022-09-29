import { isOn } from '@small-vue/shared'
// diff props
// null -> newValue   add
// value -> newValue  update
// value -> null      remove

import { patchClass } from './modules/class'
import { patchStyle } from './modules/style'
import { patchEvent } from './modules/events'
import { patchAttr } from './modules/attrs'

export const patchProp = (el, key, preValue, nextValue) => {
  if (key === 'class') {
    patchClass(el, nextValue)
  } else if (key === 'style') {
    patchStyle(el, preValue, nextValue)
  } else if (isOn(key)) {
    patchEvent(el, key, nextValue)
  } else {
    patchAttr(el, key, nextValue)
  }
}
