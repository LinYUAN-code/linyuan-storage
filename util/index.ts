

export function isObject(obj: any) {
    return obj !== null && typeof obj === 'object';
}

export function isArray(obj: any) {
    return Array.isArray(obj);
}