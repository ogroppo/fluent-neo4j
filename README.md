# Fluent Neo4j

This library allows you to build any cypher query you like and get the query string and an object with all the parameters as it's an extention of [fluent-cypher](https://github.com/ogroppo/fluent-cypher)

In addition you have the methods to fetch the results from your Neo4j instance.

## Table of Contents
* [Usage](#usage)
	* [constuctor()](#constuctor)
* [Methods](#methods)
	* [fetchRow()](#fetchRow)
	* [fetchRows()](#fetchRows)
	* [run()](#run)
* [Shortcuts](#shortcuts)
	* [fetchLastRow()](#fetchLastRow)
	* [fetchNode()](#fetchNode)
	* [fetchNodes()](#fetchNodes)
	* [fetchParent()](#fetchParent)
	* [fetchParents()](#fetchParents)
	* [fetchChild()](#fetchChild)
	* [fetchChildren()](#fetchChildren)
	* [fetchRel()](#fetchRel)
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

#### constuctor([options])

~~~js
var query = new Neo4jQuery()
~~~

See constructor options of [fluent-cypher](https://github.com/ogroppo/fluent-cypher/blob/master/README.md#constructor)

## <a name="methods"></a> Methods

All methods return a promise. So after any fetch method concatenation is not possible.

#### <a name="fetchRow"></a> fetchRow([alias])

Returns the first row of results as an object and if specified accesses the alias of the row.

~~~js
new Neo4jQuery()
	.matchNode({alias: 'myNode', name: 'myName'})
	.returnNode()
	.fetchRow().then((row)=>{
		console.log(row) // => {myNode: {name: 'myName'}}
	})
~~~

~~~js
new Neo4jQuery()
	.matchNode({alias: 'myNode', name: 'myName'})
	.returnNode()
	.fetchRow('myNode').then((myNode)=>{
		console.log(myNode) // => {name: 'myName'}
	})
~~~

#### <a name="fetchRows"></a> fetchRows([alias])

Returns results in row format, if specified results will be mapped accessing the alias.

**example:** Get rows as they are

~~~js
new Neo4jQuery()
	.matchNode({alias: 'myNode'})
	.returnNode()
	.fetchRows().then(rows => {
		console.log(rows) // => [{myNode: {name: 'myName'}}, {myNode: {name: 'myName2'}}]
	})
~~~

**example:** Extract alias from array of objects

~~~js
new Neo4jQuery()
	.matchNode({alias: 'myNode'})
	.returnNode()
	.fetchRows('myNode').then((rows)=>{
		console.log(rows) // => [{name: 'myName'}, {name: 'myName2'}]
	})
~~~

#### <a name="run"></a> run()

Runs the native `run` method of the driver returning unformatted results.

Use this method if you don't care about the result as it skips parsing of the result object.

**example:** Get the query result as the driver returns it

~~~js
new Neo4jQuery()
	.matchNode({alias: 'myNode'})
	.returnNode()
	.run().then(queryResult => {
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
~~~

## <a name="shortcuts"></a> Shortcuts

#### <a name="fetchLastRow"></a> fetchLastRow([alias])

Will return the last row of the formatted set.

~~~js
new Neo4jQuery()
	.matchNode({alias: 'myNode', label: 'Something'})
	.returnNode()
	.fetchLastRow('myNode').then((myNode)=>{
		console.log(myNode) // => {name: 'last', labels: ['Something']}
	})
~~~

#### <a name="tests"></a> How to run tests

This will test against an online test instance

~~~
npm test
~~~
