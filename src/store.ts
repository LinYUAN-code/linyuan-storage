import React, { useEffect, useReducer, useState } from "react";
import log from "./log";



const dep = new WeakMap();

// proxy handler
const handler = {
    get(target:any,key:any) {
        log.normal("get key: ", key);
        return target[key];
    },
    set(target:any,key:any,val:any,receiver:any):any {
        const result = Reflect.set(target, key, val, receiver);
        target[key] = val;
        log.normal("set! 更新依赖")
        log.normal("放入sessionStorage:", key)
        console.log(key);
        // 执行依赖函数
        // for(let fn of dep) {
            // fn();
        // }
        // return result;
        return 1;
    }
}
// proxy 不会监听深层对象喔--
let _store: any = new Proxy({},handler);
 
function makeProxy(data,isDeep:boolean = false) {
    if(!isDeep) {
        return new Proxy(data,handler);
    }
    for(let key in data) {
        data[key] = new Proxy(data,handler);
    }
    return new Proxy(data,handler);
}

// 0:Normal 1:Error
function initLogLevel(logLevel: number) {
    log.setLogLevel(logLevel);
}

// 监听浅层对象
function initStoreShallow(data: any) {
    _store = makeProxy(data,false);
}

// 监听深层对象
function initStoreDeep(data: any) {
    _store = makeProxy(data,true);
}

function useStore(fn) {
    // 注意这里使用useReducer才可以---要是使用useState会无法更新--useState必须要在对应组件内调用才会有效
    const [_, forceRender] = useReducer(s => s + 1, 0)
    // 注册
    useEffect(()=>{
        const updater = () => {
            forceRender();
        }
        dep.push(updater);
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
}