isNumber = arg => typeof arg === 'number' && isFinite(arg)

isNotNumber = arg => !isNumber(arg)

isInt = arg => Number.isInteger(arg)

isNotInt = arg => !isInt(arg)
