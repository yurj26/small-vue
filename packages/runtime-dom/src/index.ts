import { extend, isFunction, isString } from '@small-vue/shared'
import { createRenderer } from '@small-vue/runtime-core'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container)

    return res
  }

  return container as any
}

const rendererOptions = extend({ patchProp }, nodeOps)

let renderer
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions))
}

export const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args)

  const { mount } = app
  app.mount = containerOrSelector => {
    const container = normalizeContainer(containerOrSelector)
    if (!container) return

    const component = app._component
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML
    }

    container.innerHTML = ''

    const proxy = mount(container)

    return proxy
  }

  return app
}

export const render = (...args) => {
  ensureRenderer().render(...args)
}

export * from '@small-vue/runtime-core'
