export * from './shapeFlags'

export const isObject = (val) => {
  return val !== null && typeof val === 'object'
}

export const isArray = Array.isArray

export const isMap = (val: unknown): val is Map<any, any> =>
  toTypeString(val) === '[object Map]'

export const isSet = (val: unknown): val is Set<any> =>
  toTypeString(val) === '[object Set]'

export const isDate = (val: unknown): val is Date =>
  toTypeString(val) === '[object Date]'

export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'

export const isString = (val: unknown): val is string => typeof val === 'string'

export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'

export const objectToString = Object.prototype.toString

export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

export const extend = Object.assign

export function hasChanged(value, oldValue) {
  return !Object.is(value, oldValue)
}

const onRE = /^on[^a-z]/
export const isOn = (key: string) => onRE.test(key)
