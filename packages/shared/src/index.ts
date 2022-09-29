export const isObject = (val) => {
  return val !== null && typeof val === 'object'
}

export const extend = Object.assign

export function hasChanged(value, oldValue) {
  return !Object.is(value, oldValue)
}

const onRE = /^on[^a-z]/
export const isOn = (key: string) => onRE.test(key)
