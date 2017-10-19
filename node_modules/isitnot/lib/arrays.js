isArray = arg => Array.isArray(arg)

isEmptyArray = arg => Array.isArray(arg) && !arg.length

isNotEmptyArray = arg => !isEmptyArray(arg)