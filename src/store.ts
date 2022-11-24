import { useEffect, useReducer } from "react";
import { clearFromArray, isArray, isObject } from "./util";
import log from "./log";

export type updater_fn = (newValue: any, oldValue: any) => void;
export type updater = updater_fn | null;

const IS_L_STORAGE = Symbol("is_l_storage_llll");
const dep_map = new WeakMap();
// 没有传入Selector 会被加入到这个依赖队列
const all_deps: updater_fn[] = [];

// proxy handler
const handler = {
  get(target: any, key: any) {
    log.normal("get (target) (key)", target, key);
    if (_gUpdater) {
      let deps = dep_map.get(target);
      if (!deps) {
        deps = [];
        dep_map.set(target, deps);
      }
      _gDepsArr.push(deps);
      deps.push(_gUpdater);
    }
    return target[key];
  },
  set(target: any, key: any, val: any, receiver: any): any {
    const result = Reflect.set(target, key, val, receiver);
    log.normal("set (target) (key) (value)", target, key, val);
    let deps = dep_map.get(target);
    if (deps) {
      // 执行依赖函数
      for (let fn of deps) {
        fn(target[key], val);
      }
    }
    for (let fn of all_deps) {
      fn(target[key], val);
    }
    target[key] = val;
    return result;
  },
};
// proxy 不会监听深层对象喔--
let _store: any = new Proxy({}, handler);

// 设置全局依赖
let _gUpdater: updater = null;
let _gDepsArr: any[] = [];
function _setUpdater(fn: updater_fn) {
  _gUpdater = fn;
}
function _setDepsArr(arr: any[]) {
  _gDepsArr = arr;
}

function makeReactive(data: any, isDeep: boolean = false) {
  return makeProxy(data, isDeep);
}
function makeProxy(data: any, isDeep: boolean = false) {
  if (!isObject(data)) {
    //不是对象直接返回
    return data;
  }
  if (!isDeep) {
    return new Proxy(data, handler);
  }
  for (let key in data) {
    data[key] = makeProxy(data[key], isDeep);
  }
  return new Proxy(data, handler);
}

// 0:Normal 1:Error
function initLogLevel(logLevel: number) {
  console.log(initLogLevel);
  log.setLogLevel(logLevel);
}

// 监听浅层对象
function initStoreShallow(data: any) {
  initStore(data, false);
}

// 监听深层对象
function initStoreDeep(data: any) {
  initStore(data, true);
}

function initStore(data: any, isDeep: boolean) {
  if (_store === data) {
    return;
  }
  if (data[IS_L_STORAGE]) {
    _store = data;
    return;
  }
  data[IS_L_STORAGE] = true;
  _store = makeProxy(data, isDeep);
}

function useStore(fn?: (store: any) => void) {
  // 注意这里使用useReducer才可以---要是使用useState会无法更新--useState必须要在对应组件内调用才会有效
  const [_, forceRender] = useReducer((s) => s + 1, 0);
  // 注册
  useEffect(() => {
    const updater = () => {
      forceRender();
    };
    // 访问依赖链条
    if (fn) {
      let deps_arr: any[] = [];
      _setUpdater(updater);
      _setDepsArr(deps_arr);
      fn(getStore());
      _gUpdater = null;
      // 清除更新函数
      return () => {
        for (let deps of deps_arr) {
          clearFromArray(updater, deps);
        }
      };
    } else {
      // 如果没有传入fn -- 将其添加到所有的依赖中去
      all_deps.push(updater);
      return () => {
        clearFromArray(updater, all_deps);
      };
    }
  }, []);
  return _store;
}

// 直接getStore获取到的不会注册依赖回调
// 非react组件可以通过这个函数获取对象
function getStore() {
  return _store;
}

// 合并任务
function batchWork(fn: any) {}

initLogLevel(1);

class EventBus {
  public cbMap: Record<string, Array<() => void>>;
  constructor() {
    this.cbMap = {};
  }
  emit(eventName: string) {
    for (let cb of this.cbMap[eventName]) {
      cb();
    }
  }
  register(eventName: string, cb: () => void): () => void {
    if (!this.cbMap[eventName]) {
      this.cbMap[eventName] = [];
    }
    this.cbMap[eventName].push(cb);
    return cb;
  }
  remove(eventName: string, cb: () => void) {
    const pos = this.cbMap[eventName].indexOf(cb);
    if (pos === -1) return;
    this.cbMap[eventName].splice(pos, 1);
  }
}
const globalEventBus = new EventBus();

export {
  initStoreShallow,
  initStoreDeep,
  useStore,
  getStore,
  _setUpdater,
  initLogLevel,
  makeReactive,
  EventBus,
  globalEventBus,
};
