import { camelize, hyphenate, toHandlerKey } from '@small-vue/shared'

export function emit(instance, event, ...payload) {
  const props = instance.props
  // xxx -> onXxx
  let handler = props[toHandlerKey(camelize(event))]
  // change-xxx -> changeXxx
  if (!handler) {
    handler = props[toHandlerKey(hyphenate(event))]
  }

  if (handler) {
    handler(...payload)
  }
}
