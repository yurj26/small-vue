const isObject = (val) => {
    return val !== null && typeof val === 'object';
};

const reactiveMap = new WeakMap();
var ReactiveFlags;
(function (ReactiveFlags) {
    ReactiveFlags["IS_REACTIVE"] = "__v_isReactive";
})(ReactiveFlags || (ReactiveFlags = {}));
const reactive = (target) => {
    if (!isObject(target)) {
        return;
    }
    if (reactiveMap.has(target)) {
        return reactiveMap.get(target);
    }
    if (target["__v_isReactive"]) {
        return target;
    }
    const proxy = new Proxy(target, {
        get(target, key, receiver) {
            if (key === "__v_isReactive") {
                return true;
            }
            const result = Reflect.get(target, key, receiver);
            return result;
        },
        set(target, key, value, receiver) {
            const result = Reflect.set(target, key, value, receiver);
            return result;
        },
    });
    reactiveMap.set(target, proxy);
    return proxy;
};

export { reactive };
//# sourceMappingURL=small-vue.esm-bundler.js.map
