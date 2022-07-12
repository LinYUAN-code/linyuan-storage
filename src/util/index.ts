

export function isObject(obj: any) {
    return obj !== null && typeof obj === 'object';
}

export function isArray(obj: any) {
    return Array.isArray(obj);
}

export function clearFromArray(obj,arr: any[]) {
    for(let i=0;i<arr.length;i++) {
        if(arr[i] === obj) {
            arr.splice(i,1);
            break;
        }
    }
}