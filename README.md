# small-vue

实现 vue3 的核心逻辑， 深入理解 vue3 源码

### reactivity

- [x] reactive 的实现
- [x] track 依赖收集
- [x] trigger 触发依赖
- [x] 支持 effect.scheduler
- [x] 支持 effect.stop
- [x] readonly 的实现
- [x] 支持 isReactive
- [x] 支持 isReadonly
- [x] 支持嵌套 reactive
- [x] 支持嵌套 readonly
- [x] 支持 shallowReactive
- [x] 支持 shallowReadonly
- [x] 支持 isProxy
- [x] ref 的实现
- [x] 支持 isRef
- [x] 支持 unref
- [x] 支持 toRaw
- [x] 支持 proxyRefs
- [x] computed 的实现

### runtime-core

- [x] 支持 element 类型
- [x] 支持 Text 类型节点
- [x] h 函数
- [x] createVNode
- [x] element patch
- [x] diff 算法

### runtime-dom

- [x] 支持 custom renderer
