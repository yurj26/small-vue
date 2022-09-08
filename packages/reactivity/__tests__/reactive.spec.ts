import { reactive, isReactive, isProxy } from '../src/reactive'
describe('reactive', () => {
  test('Object', () => {
    const obj = {
      name: 'yrj',
      age: 18,
    }
    const proxy = reactive(obj)
    const proxy2 = reactive(proxy)

    expect(isReactive(proxy)).toBe(true)
    expect(isProxy(proxy)).toBe(true)
    expect(isProxy(obj)).toBe(false)

    expect(proxy.name).toBe('yrj')

    expect(proxy).not.toBe(obj)
    expect(proxy).toBe(proxy2)
  })

  test('nested reactives', () => {
    const obj = {
      name: 'yrj',
      age: 18,
      nested: {
        foo: 1,
      },
      arr: [{ foo: 1 }],
    }
    const proxy = reactive(obj)

    expect(isReactive(proxy.nested)).toBe(true)
    expect(isReactive(proxy.arr)).toBe(true)
    expect(isReactive(proxy.arr[0])).toBe(true)
  })
})
