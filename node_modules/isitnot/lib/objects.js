isObject = arg => typeof arg === 'object' && arg !== null && !(arg instanceof Array)

isNotObject = arg => !isObject(arg)

isEmptyObject = arg => isObject(arg) && !Object.keys(arg).length

isNotEmptyObject = arg => !isEmptyObject(arg)