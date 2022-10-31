/**
 * @jest-environment jsdom
 */
import { patchProp } from '../src/patchProp'

const timeout = () => new Promise(r => setTimeout(r))

describe(`runtime-dom: events patching`, () => {
  it('should assign event handler', async () => {
    const el = document.createElement('div')
    const fn = jest.fn()
    patchProp(el, 'onClick', null, fn)
    el.dispatchEvent(new Event('click'))
    await timeout()
    el.dispatchEvent(new Event('click'))
    await timeout()
    el.dispatchEvent(new Event('click'))
    await timeout()
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('should update event handler', async () => {
    const el = document.createElement('div')
    const prevFn = jest.fn()
    const nextFn = jest.fn()
    patchProp(el, 'onClick', null, prevFn)
    el.dispatchEvent(new Event('click'))
    patchProp(el, 'onClick', prevFn, nextFn)
    await timeout()
    el.dispatchEvent(new Event('click'))
    await timeout()
    el.dispatchEvent(new Event('click'))
    await timeout()
    expect(prevFn).toHaveBeenCalledTimes(1)
    expect(nextFn).toHaveBeenCalledTimes(2)
  })

  it('should unassign event handler', async () => {
    const el = document.createElement('div')
    const fn = jest.fn()
    patchProp(el, 'onClick', null, fn)
    patchProp(el, 'onClick', fn, null)
    el.dispatchEvent(new Event('click'))
    await timeout()
    expect(fn).not.toHaveBeenCalled()
  })

  it('should handle same computed handler function being bound on multiple targets', async () => {
    const el1 = document.createElement('div')
    const el2 = document.createElement('div')

    // const event = new Event('click')
    const prevFn = jest.fn()
    const nextFn = jest.fn()

    patchProp(el1, 'onClick', null, prevFn)
    patchProp(el2, 'onClick', null, prevFn)

    el1.dispatchEvent(new Event('click'))
    el2.dispatchEvent(new Event('click'))
    await timeout()
    expect(prevFn).toHaveBeenCalledTimes(2)
    expect(nextFn).toHaveBeenCalledTimes(0)

    patchProp(el1, 'onClick', prevFn, nextFn)
    patchProp(el2, 'onClick', prevFn, nextFn)

    el1.dispatchEvent(new Event('click'))
    el2.dispatchEvent(new Event('click'))
    await timeout()
    expect(prevFn).toHaveBeenCalledTimes(2)
    expect(nextFn).toHaveBeenCalledTimes(2)

    el1.dispatchEvent(new Event('click'))
    el2.dispatchEvent(new Event('click'))
    await timeout()
    expect(prevFn).toHaveBeenCalledTimes(2)
    expect(nextFn).toHaveBeenCalledTimes(4)
  })
})
