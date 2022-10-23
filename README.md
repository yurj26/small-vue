# small-vue

手写 vue3 的核心逻辑， 深入理解 vue3 源码

## Why

像 vue3 这种工业级别的库，源码中有很多逻辑是用于处理边缘情况或者是兼容处理逻辑，是不利于我们学习的。

我们应该关注于核心逻辑，而这个 repo 的目的就是把 vue3 源码中最核心的逻辑剥离出来，只留下核心逻辑。

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
- [x] element patch
- [x] element diff 算法 双端比较
- [x] 支持 compoonent
- [x] 支持 emit
- [x] 支持 provide/inject
- [x] 支持 getCurrentInstance

#### runtime-dom

- [x] 支持 custom renderer

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
