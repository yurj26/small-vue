export const nodeOps = {
  insert: (children, parent, anchor) => {
    parent.insertBefore(children, anchor || null)
  },

  remove: child => {
    const parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  },

  createElement: el => document.createElement(el),

  createText: text => document.createTextNode(text),

  createComment: text => document.createComment(text),

  setText: (node, text) => {
    node.nodeValue = text
  },

  setElementText: (node, text) => {
    node.textContent = text
  },

  parentNode: node => node.parentNode || null,

  nextSibling: node => node.nextSibling,

  querySelector: selector => document.querySelector(selector)
}
