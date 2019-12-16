# Fluent Neo4j

This package allows you to build any cypher query you like and get the query string and the parameters object as it's an extension of [fluent-cypher](https://github.com/ogroppo/fluent-cypher)

In addition you have the methods to run the queru or fetch the results from your Neo4j instance.

## Table of Contents
* [Usage](#usage)
	* [constuctor()](#constuctor)
* [Methods](#methods)
	* [fetch()](#fetch)
	* [fetchOne()](#fetchOne)
	* [run()](#run)
* [Tests](#tests)

## <a name="usage"></a> Usage

You'll need to set env params to connect to neo4j

~~~sh
export NEO4J_URL="bolt://localhost:7687"
export NEO4J_USER="neo4j"
export NEO4J_PASS="neo4j"
~~~

Now you can use the package on the server.

~~~js
const Neo4jQuery = require('fluent-neo4j')
//or
import Neo4jQuery from 'fluent-neo4j'
~~~

### constuctor([options])

~~~js
var query = new Neo4jQuery()
~~~

See constructor options of [fluent-cypher](https://github.com/ogroppo/fluent-cypher/blob/master/README.md#constructor)

## <a name="methods"></a> Methods

All methods return a promise. So after any fetch method building the query is not possible anymore.

### <a name="fetch"></a> .fetch([extractAlias])

Returns the first row of results as an object and if specified accesses the alias of the row.

~~~js
new Neo4jQuery()
	.match({$: 'myNode', name: 'Jhonny'})
	.return('myNode')
	.fetch()
	.then((rows) => {
		console.log(rows) // => [{myNode: {id: 123, name: 'Jhonny'}}]
	})
	.catch((err) => console.error(err))
~~~

~~~js
new Neo4jQuery()
	.match({$: 'myNode', name: 'Jhonny'})
	.return('myNode')
	.fetch('myNode')
	.then((rows)=>{
		console.log(rows) // => [{id: 1234, name: 'Jhonny'}]
	})
	.catch((err) => console.error(err))
~~~

### <a name="fetchOne"></a> fetchOne([extractAlias])

Returns the first record, if specified the result will be brought top-level accessing the alias given.

~~~js
new Neo4jQuery()
	.match({$: 'myNode', name: 'Jhonny'}, {$: 'someoneElse', name: 'Bo'}))
	.return('myNode', 'someoneElse')
	.fetchOne()
	.then(row => {
		console.log(row) // => {myNode: {id: 1234, name: 'Jhonny'}, someoneElse: {...}}
	})
	.catch((err) => console.error(err))
~~~

~~~js
new Neo4jQuery()
	.match({$: 'myNode', name: 'Jhonny'}, {$: 'someoneElse', name: 'Bo'})
	.return('myNode', 'someoneElse')
	.fetchOne('myNode')
	.then(row => {
		console.log(row) // => {id: 1234, name: 'Jhonny'}
	})
	.catch((err) => console.error(err))
~~~

### <a name="run"></a> run()

Runs the native `run` method of the driver returning unformatted results.

Use this method if you don't care about the result as it skips parsing of the result object.

**example:** Get the query result as the driver returns it

~~~js
new Neo4jQuery()
	.match({$: 'myNode'})
	.return()
	.run()
	.then(queryResult => {
		console.log(queryResult)
	// 	{ records:
  //  [ Record {
  //      keys: [Array],
  //      length: 1,
  //      _fields: [Array],
  //      _fieldLookup: [Object] },
  //    Record {
  //      keys: [Array],
  //      length: 1,
  //      _fields: [Array],
  //      _fieldLookup: [Object] },
  //    Record {
  //      keys: [Array],
  //      length: 1,
  //      _fields: [Array],
  //      _fieldLookup: [Object] } ],
  // summary:
  //  ResultSummary {
  //    statement:
  //     { text: 'MATCH (node {name:{name0}}) RETURN node as node ',
  //       parameters: [Object] },
  //    statementType: 'r',
  //    counters: StatementStatistics { _stats: [Object] },
  //    updateStatistics: StatementStatistics { _stats: [Object] },
  //    plan: false,
  //    profile: false,
  //    notifications: [],
  //    server:
  //     ServerInfo {
  //       address: 'hobby-necdejfcclhegbkeceejghal.dbs.graphenedb.com:24786',
  //       version: 'Neo4j/3.3.0' },
  //    resultConsumedAfter: Integer { low: 1, high: 0 },
  //    resultAvailableAfter: Integer { low: 1, high: 0 } } }
	})
	.catch((err) => console.error(err))
~~~

## <a name="tests"></a> How to run tests

This will test against an online test instance

~~~
npm test
~~~

This will test against a local instance - you'll need to set env vars.

**WARNING: Make sure you are using a test database as this adds and deletes data!**

~~~
npm run test-local
~~~
