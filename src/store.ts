import React, { useEffect, useReducer, useState } from "react";
import { isObject } from "../util";
import log from "./log";



const IS_L_STORAGE = Symbol("is_l_storage_llll");
const dep_map = new WeakMap();

// proxy handler
const handler = {
    get(target:any,key:any) {
        log.normal("get key: ", key);
        if(_gUpdater) {
            let deps = dep_map.get(target);
            if(!deps) {
                deps = [];
                dep_map.set(target,deps);
            }
            deps.push(_gUpdater);
        }
        return target[key];
    },
    set(target:any,key:any,val:any,receiver:any):any {
        const result = Reflect.set(target, key, val, receiver);
        log.normal("set! 更新依赖")
        log.normal("放入sessionStorage:", key,target);
        let deps = dep_map.get(target);
        if(deps) {
            // 执行依赖函数
            for(let fn of deps) {
                fn(target[key],val);
            }
        }
        target[key] = val;
        return result;
    }
}
// proxy 不会监听深层对象喔--
let _store: any = new Proxy({},handler);

// 设置全局依赖
let _gUpdater: updater = null;
function _setUpdater(fn: updater) {
    _gUpdater = fn;
}

function makeProxy(data,isDeep:boolean = false) {
    if(!isObject(data)) { //不是对象直接返回
        return data;
    }
    if(!isDeep) {
        return new Proxy(data,handler);
    }
    for(let key in data) {
        console.log(data,key);
        data[key] = makeProxy(data[key],isDeep);
    }
    return new Proxy(data,handler);
}

// 0:Normal 1:Error
function initLogLevel(logLevel: number) {
    log.setLogLevel(logLevel);
}

// 监听浅层对象
function initStoreShallow(data: any) {
    initStore(data,false);
}

// 监听深层对象
function initStoreDeep(data: any) {
    initStore(data,true);
}

function initStore(data: any,isDeep: boolean) {
    if(_store === data) {
        return ;
    }
    if(data[IS_L_STORAGE]) {
        _store = data;
        return ;
    }
    data[IS_L_STORAGE] = true;
    _store = makeProxy(data,isDeep);
}


function useStore(fn) {
    // 注意这里使用useReducer才可以---要是使用useState会无法更新--useState必须要在对应组件内调用才会有效
    const [_, forceRender] = useReducer(s => s + 1, 0)
    // 注册
    useEffect(()=>{
        const updater = () => {
            forceRender();
        }
        _setUpdater(updater);
        // 访问依赖链条
        

        const deps = dep_map.get()
        // 清楚更新函数
        return ()=>{
            dep.forEach((v,index)=>{
                if(v===updater) {
                    dep.splice(index,1);
                }
            })
        }
    },[]);
    return _store;
}

// 直接getStore获取到的不会注册依赖回调
function getStore() {
    return _store;
}

export  {
    initStoreShallow,
    initStoreDeep, 
    useStore,
    getStore,
    _setUpdater,
}