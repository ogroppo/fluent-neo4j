isString = arg => typeof arg === 'string'

isNotString = arg => !isString(arg)

isStringAndNotEmpty = arg => isString(arg) && isNotEmptyString(arg)

isEmptyString = arg => isString(arg) && !arg.trim()

isNotEmptyString = arg => !isEmptyString(arg)

isEmail = arg => isString(arg) && /\S+@\S+\.\S+/.test(arg)

isNotEmail = arg => !isEmail(arg)

const variableNameRegex = new RegExp('^[a-zA-Z_$][0-9a-zA-Z_$]*$')

isVariableName = (arg) => variableNameRegex.test(arg) 

isNotVariableName = (arg) => !isVariableName(arg)
