import { invokeArrayFns, ShapeFlags } from '@small-vue/shared'
import { isSameVNodeType, Text, Fragment } from './vnode'
import { createAppAPI } from './apiCreateApp'
import { createComponentInstance, setupComponent } from './component'
import { ReactiveEffect } from '@small-vue/reactivity'
import { queueJob } from './scheduler'
import { updateProps } from './componentProps'
import { shouldUpdateComponent } from './componentRenderUtils'
export const createRenderer = renderOptions => {
  const {
    createElement: hostCreateElement,
    setElementText: hostSetElementText,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setText: hostSetText,
    createText: hostCreateText
  } = renderOptions

  const render = (vnode, container) => {
    if (vnode == null) {
      // 卸载节点
      if (container._vnode) {
        unmount(container._vnode)
      }
    } else {
      patch(container._vnode || null, vnode, container)
    }
    container._vnode = vnode
  }

  function patch(
    n1,
    n2,
    container = null,
    anchor = null,
    parentComponent = null
  ) {
    if (n1 === n2) {
      return
    }
    // 如果vnode不是同一类型，卸载老节点
    if (n1 && !isSameVNodeType(n1, n2)) {
      unmount(n1)
      n1 = null
    }
    // 渲染核心逻辑
    const { type, shapeFlag } = n2

    switch (type) {
      case Text:
        processText(n1, n2, container)
        break
      case Fragment:
        processFragment(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, anchor, parentComponent)
        }
    }
  }

  function mountElement(vnode, container, anchor) {
    const { type, props, children, shapeFlag } = vnode
    const el = (vnode.el = hostCreateElement(type))

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // h('h1', {}, 'text')
      hostSetElementText(el, children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // h('h1', {}, [h(), h()])
      // 递归处理数组元素
      mountChildren(children, el)
    }

    if (props) {
      for (let key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }

    hostInsert(el, container, anchor)
  }

  function unmount(vnode) {
    // todo component的卸载
    hostRemove(vnode.el)
  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      unmount(children[i])
    }
  }

  function patchElement(n1, n2, container, anchor) {
    const oldProps = n1?.props || {}
    const newProps = n2?.props || {}

    // 需要把 el 挂载到新的 vnode
    const el = (n2.el = n1.el)
    // 比对属性
    patchProps(el, oldProps, newProps)
    // 比对children
    patchChildren(n1, n2, el, anchor)
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      // { id: 1 } -> { id: 2 }
      for (let key in newProps) {
        const next = newProps[key]
        const pre = oldProps[key]
        if (next !== pre) {
          hostPatchProp(el, key, pre, next)
        }
      }
      // { id: 1, uId: 2} -> { id: 1 }
      if (oldProps) {
        for (let key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
  }

  function patchChildren(n1, n2, container, anchor) {
    const { shapeFlag: prevShapeFlag, children: c1 } = n1
    const { shapeFlag, children: c2 } = n2
    // children type: array | text | null
    // prev      new
    // array     array
    // text  ->  text
    // null      null

    // array -> text 删除元素，设置文本内容
    // text -> text  更新文本
    // null -> text  更新文本

    // array -> array diff算法，比较元素
    // text -> array  清空文本，进行挂载
    // null -> array  进行挂载

    // array -> null 删除元素
    // text -> null  清空文本
    // null -> null  无处理

    // array | text -> text
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // prev children: array
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1)
        console.log('array -> text')
      }
      if (c1 !== c2) {
        console.log('text -> text')
        hostSetElementText(container, c2)
      }
    } else {
      // prev children: array
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // array -> array  diff
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          console.log('array -> array')
          patchKeyedChildren(n1.children, n2.children, container, anchor)
        } else {
          // array -> null
          console.log('array -> null')
          unmountChildren(c1)
        }
      } else {
        //prev children: text

        // text -> array | null
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          console.log('text -> null')
          hostSetElementText(container, '')
        }

        // text -> array
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          console.log('text -> array')
          mountChildren(c2, container)
        }
      }
    }
  }

  function patchKeyedChildren(c1, c2, container, anchor) {
    let i = 0
    const l2 = c2.length
    let e1 = c1.length - 1
    let e2 = l2 - 1

    // sync from start
    // (a, b)
    // (a, b) c
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]

      if (isSameVNodeType(n1, n2)) {
        // 比对子元素
        patch(n1, n2, container, anchor)
      } else {
        break
      }
      i++
    }

    // sync from end
    // (a, b)
    // c, (a, b)
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]

      if (isSameVNodeType(n1, n2)) {
        // 比对子元素
        patch(n1, n2, container, anchor)
      } else {
        break
      }
      e1--
      e2--
    }
    // common sequence + mount
    // (a b)
    // (a b) c
    // i = 2, e1 = 1, e2 = 2
    // (a b)
    // c (a b)
    // i = 0, e1 = -1, e2 = 0
    if (i > e1 && i <= e2) {
      const nextPos = e2 + 1
      const anchor = nextPos < l2 ? c2[nextPos].el : null
      while (i <= e2) {
        // 插入节点
        patch(null, c2[i], container, anchor)
        i++
      }
    }
    // common sequence + unmount
    // (a b) c
    // (a b)
    // i = 2, e1 = 2, e2 = 1
    // a (b c)
    // (b c)
    // i = 0, e1 = 0, e2 = -1
    else if (i > e2 && i <= e1) {
      while (i <= e1) {
        unmount(c1[i])
        i++
      }
    }
    // unknown sequence
    // a b [c d e] f g
    // a b [e d c h] f g
    // i = 2, e1 = 4, e2 = 5
    else {
      let s1 = i
      let s2 = i

      const keyToNewIndexMap = new Map()
      // { e:2, d:3, c:4, h:5 }
      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i]
        if (nextChild != null) {
          keyToNewIndexMap.set(c2[i].key, i)
        }
      }
      console.log('新序列节点对应的下标', keyToNewIndexMap)

      // 已经patch的节点个数
      let patched = 0
      // 需要patch的节点个数
      // 5 - 2 + 1 = 4  对应的 [e d c h]
      const toBePatched = e2 - s2 + 1
      // 判断节点是否需要移动
      let moved = false
      // 记录节点是否移动
      let maxNewIndexSoFar = 0
      // 新序列节点在旧序列节点中对应的下标
      // [0,0,0,0]
      const newIndexToOldIndexMap = new Array(toBePatched).fill(0)
      // 遍历旧序列的子节点
      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i]
        // 所有新节点已经被patch，移除旧的
        if (patched >= toBePatched) {
          unmount(prevChild)
          continue
        }
        // 在新序列中该旧节点对应的下标
        let newIndex
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          // 如果没有key，找到相同类型的
          for (let j = s2; j <= e2; j++) {
            if (
              newIndexToOldIndexMap[j - s2] === 0 &&
              isSameVNodeType(prevChild, c2[j])
            ) {
              newIndex = j
              break
            }
          }
        }
        // 如果在新序列中没有找到下标，删除该节点
        if (newIndex === undefined) {
          unmount(prevChild)
        } else {
          // 新序列节点在旧序列节点的对应下标
          // 减去s2是因为是从s2开始
          // i + 1是因为i有可能为0（0的话会认为在老节点中不存在）

          // old: { e:4, d:3, c:2, h:0 }
          // new: { e:2, d:3, c:4, h:5 }
          // newIndexToOldIndexMap: [e:0,d:0,:c:0,;h:0] -> [5,4,3,0]
          newIndexToOldIndexMap[newIndex - s2] = i + 1

          if (newIndex > maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            // 不是升序的，需要移动
            moved = true
          }

          patch(prevChild, c2[newIndex], container)
          patched++
        }
      }

      // 移动和创建新节点
      // 核心算法：利用最长递增子序列优化移动逻辑
      // 如果序列是升序的话，不需要移动，通过moved进行判断
      // getSequence返回的是最长子序列对应的下标
      // increasingNewIndexSequence = [5,4,3,0] -> [3] -> [2]
      // 3是[5,4,3,0]的最长递增子序列，对应的下标就是2
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : []
      // 0
      let j = increasingNewIndexSequence.length - 1

      console.log('新序列节点在旧序列的对应下标+1', newIndexToOldIndexMap)
      console.log(
        '最长子序列',
        increasingNewIndexSequence,
        increasingNewIndexSequence.map(
          index => [...keyToNewIndexMap.keys()][index]
        )
      )

      // 从后往前遍历新节点，方便找出插入元素的anchor
      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i
        const nextChild = c2[nextIndex]
        // 下一个节点作为anchor
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null
        // 旧序列不存在当前节点，需要创建  h
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, anchor)
        } else if (moved) {
          // 需要移动
          // 如果没有最长子序列 或 最长子序列的值和当前匹配不上
          if (j < 0 || increasingNewIndexSequence[j] !== i) {
            console.log(`在${c2[nextIndex + 1].key}前插入${nextChild.key}`)
            // 移动节点，insertBefore传入已有元素，有移动功能
            hostInsert(nextChild.el, container, anchor)
          } else {
            j--
          }
        }
      }
    }
  }

  // 取一个最大递增子序列, 用于记录相对位置没有发生变化的子节点的下标
  function getSequence(arr: number[]): number[] {
    const p = arr.slice()
    const result = [0]
    let i, j, u, v, c
    const len = arr.length
    for (i = 0; i < len; i++) {
      const arrI = arr[i]
      if (arrI !== 0) {
        j = result[result.length - 1]
        if (arr[j] < arrI) {
          p[i] = j
          result.push(i)
          continue
        }
        u = 0
        v = result.length - 1
        while (u < v) {
          c = (u + v) >> 1
          if (arr[result[c]] < arrI) {
            u = c + 1
          } else {
            v = c
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1]
          }
          result[u] = i
        }
      }
    }
    u = result.length
    v = result[u - 1]
    while (u-- > 0) {
      result[u] = v
      v = p[v]
    }
    return result
  }

  function mountChildren(children, container) {
    // 递归子元素 创建
    children.forEach(VNodeChild => {
      patch(null, VNodeChild, container)
    })
  }

  function processText(n1, n2, container) {
    // 文本元素节点的创建和更新
    if (n1 == null) {
      hostInsert((n2.el = hostCreateText(n2.children)), container)
    } else {
      const el = (n2.el = n1.el)
      if (n1.children !== n2.children) {
        hostSetText(el, n2.children)
      }
    }
  }

  function processElement(n1, n2, container, anchor) {
    if (!n1) {
      // 创建节点
      mountElement(n2, container, anchor)
    } else {
      // 更新节点
      patchElement(n1, n2, container, anchor)
    }
  }

  function processFragment(n1, n2, container) {
    if (n1 == null) {
      mountChildren(n2.children, container)
    } else {
      patchChildren(n1, n2, container, null)
    }
  }

  function processComponent(n1, n2, container, anchor, parentComponent) {
    if (n1 == null) {
      // 创建组件
      mountComponent(n2, container, anchor, parentComponent)
    } else {
      // 更新组件  更新props
      updateComponent(n1, n2)
    }
  }

  function mountComponent(vnode, container, anchor, parentComponent) {
    // 创建组件实例
    const instance = (vnode.component = createComponentInstance(
      vnode,
      parentComponent
    ))
    // 实例赋值
    setupComponent(instance)
    // effect 渲染组件
    setupRenderEffect(instance, container, anchor)
  }
  // 组件更新前的操作
  function updateComponentPreRender(instance, nextVNode) {
    instance.next = null
    instance.vnode = nextVNode
    updateProps(instance.props, nextVNode.props)
  }

  function setupRenderEffect(instance, container, anchor) {
    function componentUpdateFn() {
      if (!instance.isMounted) {
        const { bm, m, render } = instance
        // onBeforeMount
        if (bm) {
          invokeArrayFns(bm)
        }
        const subTree = render.call(instance.proxy)
        patch(null, subTree, container, anchor, instance)
        // onMounted
        if (m) {
          invokeArrayFns(m)
        }
        instance.subTree = subTree
        instance.isMounted = true
      } else {
        const { bu, u, next, render } = instance
        if (next) {
          updateComponentPreRender(instance, next)
        }
        // onBeforeMount
        if (bu) {
          invokeArrayFns(bu)
        }
        const subTree = render.call(instance.proxy)
        patch(instance.subTree, subTree, container, anchor, instance)
        // onUpdated
        if (u) {
          invokeArrayFns(u)
        }
        instance.subTree = subTree
      }
    }

    const effect = new ReactiveEffect(componentUpdateFn, () =>
      queueJob(instance.update)
    )
    let update = (instance.update = effect.run.bind(effect))
    update()
  }

  function updateComponent(n1, n2) {
    // 复用instance实例
    const instance = (n2.component = n1.component)
    // 需要更新了才进行更新
    if (shouldUpdateComponent(n1, n2)) {
      instance.next = n2
      instance.update()
    }
  }

  return {
    render,
    createApp: createAppAPI(render)
  }
}
