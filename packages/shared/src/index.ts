export const isObject = (val) => {
  return val !== null && typeof val === 'object'
}

export const extend = Object.assign
