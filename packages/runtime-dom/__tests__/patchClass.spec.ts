/**
 * @jest-environment jsdom
 */
import { patchProp } from '../src/patchProp'

describe('runtime-dom: class patching', () => {
  test('basics', () => {
    const el = document.createElement('div')
    patchProp(el, 'class', null, 'foo')
    expect(el.className).toBe('foo')
    patchProp(el, 'class', null, null)
    expect(el.className).toBe('')
  })
})
