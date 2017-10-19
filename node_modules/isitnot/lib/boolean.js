isBoolean = arg => Object.prototype.toString.call(arg) === '[object Boolean]'

isNotBoolean = arg => !isBoolean(arg)