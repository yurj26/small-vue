# small-vue

手写 vue3 的核心逻辑

## Why

vue3 核心源码，帮助开发者深入理解 vue，了解实现原理，源码库中有很多逻辑是用于处理边缘情况或兼容性，

不利于学习，而此项目就是把 vue3 源码中最核心的逻辑剥离出来，只留下了核心逻辑，并添加了注释方便阅读。

### Tasking

#### reactivity

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

#### runtime-core

- [x] 支持 element 类型
- [x] 支持 Text 类型节点
- [x] 支持 Fragment 类型节点
- [x] h 函数
- [x] createVNode
- [x] vnode patch
- [x] diff 算法 双端比较
- [x] 支持 component
- [x] 支持 emit
- [x] 支持 provide/inject
- [x] 支持 getCurrentInstance
- [x] 支持 slots
- [x] 支持 nextTick
- [x] 支持 lifecycle
- [x] 支持 setup 函数

#### runtime-dom

- [x] 支持 custom renderer
- [x] 支持 patchProp
- [x] 支持 nodeOps
- [x] render 函数
- [x] createApp 函数

#### todo

compiler-core

### Start

```shell
# install
pnpm install

# develop
pnpm dev
```

### Test

执行 pnpm test 可以跑测试，如果你使用的是 vscode 建议安装 Jest runner 插件，Jest runner 可以帮助你在 vscode 中更方便的进行断点调试。

> 推荐使用 [Jest Runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner)

### Example

通过 server 的方式打开 packages/vue/example/\* 下的 index.html 即可

> 推荐使用 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
