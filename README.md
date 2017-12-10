# Fluent Neo4j

## Speak fluently to your graph database

This library allows you to build any cypher query you like and get the query string and an object with all the parameters.

Following the official documentation it is better to avoid literals so everything is treated as a param.

## Table of Contents
* [Usage](#usage)
* [Building the query](#building)
	* [CREATE](#createMethods)
		* [create()](#create)
		* [createNode()](#createNode)
		* [createRel()](#createRel)
	* [MATCH](#matchMethods)
		* [match()](#match)
		* [matchNode()](#matchNode)
		* [matchRel()](#matchRel)
	* [MERGE](#mergeMethods)
		* [merge()](#merge)
		* [mergeNode()](#mergeNode)
		* [mergeRel()](#mergeRel)
* [Debug](#debug)
* [Tests](#tests)

## <a name="usage"></a> Usage

~~~

npm install fluent-neo4j --save

~~~

You'll need to set env params to connect to neo4j

~~~sh

export NEO4J_URL="bolt://localhost"
export NEO4J_USER="neo4j"
export NEO4J_PASS="neo4j"

~~~

Now you can use the package in your script

~~~js

const Neo4jQuery = require('fluent-neo4j')
var query = new Neo4jQuery([options])

query.queryString // => ''
query.queryParams // => {}

~~~

#### contructor options

` timestamps ` Bool, default: __false__
if you set to true timestamps will be added for you like `alias.createdAt = timestamp()` and `alias.updatedAt = timestamp()`


`userId` String, if set the properties `alias.createdBy = {userId}` and `alias.updatedBy = {userId}`

## <a name="building"></a> Building the query

### <a name="createMethods"></a> CREATE Methods

#### <a name="create"></a> create

Generic method that accepts custom string as a pattern

~~~js

query.create([...patterns])

query.create() // ''

query.create("(node)") // 'CREATE (node)'

query.create("(node)", "()->[rel]->()") // 'CREATE (node), ()->[rel]->()'

~~~

#### <a name="createNode"></a> createNode

Accepts object with properties, labels, alias.

~~~js

query.createNode([cypherNode] [, options])

query.createNode() // CREATE (node)

query.createNode({alias: 'myNode', label: 'Obj', labels: ['this', 'fancy label']}) // CREATE (myNode:`Obj`:`this`:`fancy label`)

~~~

#### <a name="createRel"></a> createRel

Accepts object with properties, labels, alias.

~~~js

query.createRel([cypherRel] [, options])

query.createRel() // CREATE ()->[rel]->()

query.createRel({alias: 'myRel', type: 'REL', myProp: 'myVal'}) // CREATE ()->[myRel:`REL` {myProp:'myVal'}]->()

~~~

### <a name="matchMethods"></a> MATCH methods

#### <a name="match"></a> match

~~~js

query.match([...patterns])

query.match() // ''

query.match("(node)") // MATCH (node)

query.match("(node)", "()->[rel]->()") // MATCH (node), ()->[rel]->()

~~~

#### <a name="matchNode"></a> matchNode

~~~js

query.matchNode([cypherNode] [, options])

query.matchNode() // MATCH (node)

query.matchNode({alias: 'myNode', label: 'Obj', labels: ['this', 'fancy label']}) // MATCH (myNode:`Obj`:`this`:`fancy label`)

~~~

#### <a name="matchRel"></a> matchRel

~~~js

query.matchRel([cypherNode] [, options])

query.matchRel() // MATCH ()->[rel]->()

query.matchRel({alias: 'myRel', type: 'REL'}) // MATCH ()->[rel:`REL`]->()

~~~

### <a name="mergeMethods"></a> MERGE methods

#### <a name="merge"></a> merge

~~~js

query.merge([...patterns])

query.merge() // ''

query.merge("(node)") // MERGE (node)

query.merge("(node)", "()->[rel:`type`]->()") // MERGE (node), ()->[rel:`type`]->()

~~~

#### <a name="mergeNode"></a> mergeNode

~~~js

query.mergeNode([cypherNode] [, options])

query.mergeNode() // MERGE (node)

query.mergeNode({alias: 'email', name: 'spam@email.com', label: 'Email', labels: ['Verified', 'Blocked']}) // MERGE (email:`Email`:`Verified`:`Blocked`)

~~~

#### <a name="mergeRel"></a> mergeRel

~~~js

query.mergeRel(cypherRel [, options])

query.mergeRel({alias: 'friendship', type: 'friend of'}) // MERGE ()->[friendship:`friend of`]->()

~~~

### WHERE

- IN

- STARTS WITH

- ENDS WITH

- Regexp

Provide your own custom regexp


NB: You need to escape the regexp youself! It might not throw an error but results will be wrong, use built in function

~~~js

query.matchNode().wherePropRegexp({
	propName: `(?i).*$(query._escapeStringRegexp("{}+&?!")}.*`,
	otherPropName: "(?g).*doesNotNeedToBeEscaped.*",
})

~~~


### Functions available (they all return promises)

##### .get([alias])

Returns first row of results and if specified accesses the alias of the row

**example**

~~~js
	var query = new Neo4jQuery()
		.matchNode({alias: 'myNode', name: 'myName'})
		.returnNode().get().then((result)=>{
			console.log(result) // => {myNode: {name: 'myName'}}
		})
~~~

~~~js
	var query = new Neo4jQuery()
		.matchNode({alias: 'myNode', name: 'myName'})
		.returnNode().get('myNode').then((result)=>{
			console.log(result) // => {name: 'myName'}
		})
~~~

##### .getAll([alias])

Returns all rows of results, if specified results will be mapped accessing the alias.

**example**

~~~js
	var query = new Neo4jQuery()
		.matchNode({alias: 'myNode'})
		.returnNode().getAll().then((result)=>{
			console.log(result) // => [{myNode: {name: 'myName'}}, {myNode: {name: 'myName2'}}]
		})
~~~

~~~js
	var query = new Neo4jQuery()
		.matchNode({alias: 'myNode'})
		.returnNode().getAll('myNode').then((result)=>{
			console.log(result) // => [{name: 'myName'}, {name: 'myName2'}]
		})
~~~

##### .getNode()

Shortcut for .get('node')

##### .getRel()

Shortcut for .get('rel')

### <a name="debug"></a> debug

As `query.queryString` is a parametrised string you may want to print a string that you can copy and paste in the browser console.

~~~js

query
	.matchNode()
	.debug()     // => MATCH (node)
	.matchRel()
	.debug()    // => MATCH (node) MATCH ()-[rel]->)()

~~~



### <a name="tests"></a> Tests

#### <a name="libtest"></a> How to test the library

This will test against an online test instance

~~~js

npm test

~~~

If you want to test against a local instance do

~~~js

export NEO4J_URL="bolt://localhost"
export NEO4J_USER="neo4j"
export NEO4J_PASS="neo4j"

npm test-local

~~~
