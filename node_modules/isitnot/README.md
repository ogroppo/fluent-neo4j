# isitnot
Type checking package for JavaScript, include just once in your entrypoint like

index.js

require('isitnot');


## Available (global) functions

### Strings

~~~js
isString('') //true

isNotString(()=>{}) //true

isStringAndNotEmpty('') //false

isStringAndNotEmpty(' ') //false

isStringAndNotEmpty('hey') //true

isEmptyString({}) //false

isEmptyString('') //true

isNotEmptyString('') //false

isEmail('a@b.c') //true

isNotEmail('whatever@domain') //true

isVariableName('var') //true (technically not, but it can be a property of an object accessed without ['...'])

isVariableName('oh dear') //false

isVariableName('0rel') //false cannot start with number

isVariableName('var0') //true

isNotVariableName('a@a') //true

~~~

### Arrays

~~~js
isArray([]) // true

isArray({}) // false

isEmptyArray([]) // true

isEmptyArray(['1']) // false

isNotEmptyArray([]) // false
~~~

### Objects

~~~js
isObject([]) // FALSE, arrays are not objects for this library

isObject({}) // true

isNotObject('') //true

isEmptyObject([]) //false

isNotEmptyObject({a: 1}) //true
~~~


### Numbers

~~~js
isNumber(1) //true

isNotNumber(NaN) //true

isInt(0) //true

isNotInt(1.2) //true
~~~

### Generic

~~~js
isEmpty([]) //true

isEmpty('') //true

isEmpty(' ') //true

isEmpty({}) //true

isEmpty(null) //true

isEmpty(undefined) //true

isEmpty(0) //false

isNotEmpty('hey') //true
~~~

### Dates

~~~js
isDate('') //false

isNotDate('') //true

isDate(new Date()) //true

isDate('1970-01-01T00:00:00.000Z') //true

isDate('1970-01-01T00:00:00') //true

isDate('1970-01-01T00:00') //true

isDate('1970-01-01') //true

isDate('0000-00-00') //false

isDate('1970-13-01') //false (bad month)

isDate('1970-01-32') //false (bad day)

isDate('2017-02-29') //false (not leap year)
~~~
