import { camelize, hyphenate, toHandlerKey } from '@small-vue/shared'

export function emit(instance, event, ...payload) {
  const props = instance.props
  // toHandlerKey: xxx -> onXxx
  // change-xxx -> changeXxx to find
  let handler = props[toHandlerKey(camelize(event))]

  if (!handler) {
    // changeXxx -> change-xxx to find
    handler = props[toHandlerKey(hyphenate(event))]
  }

  if (handler) {
    handler(...payload)
  }
}
