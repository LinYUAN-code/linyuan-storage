// src/store.ts
import { useEffect, useReducer } from "react";

// src/util/index.ts
function isObject(obj) {
  return obj !== null && typeof obj === "object";
}
function clearFromArray(obj, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === obj) {
      arr.splice(i, 1);
      break;
    }
  }
}

// src/log.ts
var __log_level = 0 /* Normal */;
function setLogLevel(logLevel) {
  console.log("setLogLevel:", logLevel);
  __log_level = logLevel;
}
function normal(...msg) {
  if (__log_level <= 0 /* Normal */) {
    console.log(...msg);
  }
}
function error(...msg) {
  if (__log_level <= 1 /* Error */) {
    console.log(...msg);
  }
}
var log = {
  normal,
  error,
  setLogLevel
};
var log_default = log;

// src/store.ts
var IS_L_STORAGE = Symbol("is_l_storage_llll");
var dep_map = /* @__PURE__ */ new WeakMap();
var all_deps = [];
var handler = {
  get(target, key) {
    log_default.normal("get (target) (key)", target, key);
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
  set(target, key, val, receiver) {
    const result = Reflect.set(target, key, val, receiver);
    log_default.normal("set (target) (key) (value)", target, key, val);
    let deps = dep_map.get(target);
    if (deps) {
      for (let fn of deps) {
        fn(target[key], val);
      }
    }
    for (let fn of all_deps) {
      fn(target[key], val);
    }
    target[key] = val;
    return result;
  }
};
var _store = new Proxy({}, handler);
var _gUpdater = null;
var _gDepsArr = [];
function _setUpdater(fn) {
  _gUpdater = fn;
}
function _setDepsArr(arr) {
  _gDepsArr = arr;
}
function makeReactive(data, isDeep = false) {
  return makeProxy(data, isDeep);
}
function makeProxy(data, isDeep = false) {
  if (!isObject(data)) {
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
function initLogLevel(logLevel) {
  console.log(initLogLevel);
  log_default.setLogLevel(logLevel);
}
function initStoreShallow(data) {
  initStore(data, false);
}
function initStoreDeep(data) {
  initStore(data, true);
}
function initStore(data, isDeep) {
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
function useStore(fn) {
  const [_, forceRender] = useReducer((s) => s + 1, 0);
  useEffect(() => {
    const updater = () => {
      forceRender();
    };
    if (fn) {
      let deps_arr = [];
      _setUpdater(updater);
      _setDepsArr(deps_arr);
      fn(getStore());
      _gUpdater = null;
      return () => {
        for (let deps of deps_arr) {
          clearFromArray(updater, deps);
        }
      };
    } else {
      all_deps.push(updater);
      return () => {
        clearFromArray(updater, all_deps);
      };
    }
  }, []);
  return _store;
}
function getStore() {
  return _store;
}
initLogLevel(1);
export {
  _setUpdater,
  getStore,
  initLogLevel,
  initStoreDeep,
  initStoreShallow,
  makeReactive,
  useStore
};
