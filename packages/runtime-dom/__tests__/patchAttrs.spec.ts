/**
 * @jest-environment jsdom
 */
import { patchProp } from '../src/patchProp'
describe('runtime-dom: attrs patching', () => {
  test('attributes', () => {
    const el = document.createElement('div')
    patchProp(el, 'foo', null, 'a')
    expect(el.getAttribute('foo')).toBe('a')
    patchProp(el, 'foo', 'a', null)
    expect(el.getAttribute('foo')).toBe(null)
  })

  test('onxxx but non-listener attributes', () => {
    const el = document.createElement('div')
    patchProp(el, 'onwards', null, 'a')
    expect(el.getAttribute('onwards')).toBe('a')
    patchProp(el, 'onwards', 'a', null)
    expect(el.getAttribute('onwards')).toBe(null)
  })
})
