# Fluent Neo4j

## Speak fluently to your graph database

This library allows you to build any cypher query you like and get the query string and an object with all the parameters.

Following the official documentation it is better to avoid literals so everything is treated as a param.

You'll need to set env params to connect to neo4j

e.g.

~~~sh

export NEO4J_URL="bolt://localhost"
export NEO4J_USER="neo4j"
export NEO4J_PASS="neo4j"

npm start

~~~

## Table of Contents
1. [Usage](#usage)
2. [Building the query](#building)
	1. [CREATE](#create)
	2. [MATCH](#match)
3. [Tests](#tests)

## <a name="usage"></a> Usage

~~~js

const query = new CypherQuery([options])

query.queryString // => ''
query.queryParams // => {}

~~~

options:

timestamps

userId

## <a name="building"></a> Building the query

### <a name="create"></a> CREATE

- Generic

~~~js

query.create([...patterns])

query.create() // ''

query.create("(node)") // 'CREATE (node)'

query.create("(node)", "()->[rel]->()") // 'CREATE (node), ()->[rel]->()'

~~~

- Node

~~~js

query.createNode([cypherNode] [, options])

query.createNode() // CREATE (node)

query.createNode({alias: 'myNode', label: 'Obj', labels: ['this', 'fancy label']}) // CREATE (myNode:`Obj`:`this`:`fancy label`)

~~~

- Rel

~~~js

query.createRel([cypherRel] [, options])

query.createRel() // CREATE ()->[rel]->()

query.createRel({alias: 'myRel', type: 'REL'}) // CREATE ()->[rel:`REL`]->()

~~~

### <a name="match"></a> MATCH

- Generic

~~~js

query.match([...patterns])

query.match() // ''

query.match("(node)") // MATCH (node)

query.match("(node)", "()->[rel]->()") // MATCH (node), ()->[rel]->()

~~~

- Node

~~~js

query.matchNode([cypherNode] [, options])

query.matchNode() // MATCH (node)

query.matchNode({alias: 'myNode', label: 'Obj', labels: ['this', 'fancy label']}) // MATCH (myNode:`Obj`:`this`:`fancy label`)

~~~

- Rel

~~~js

query.matchRel([cypherNode] [, options])

query.matchRel() // MATCH ()->[rel]->()

query.matchRel({alias: 'myRel', type: 'REL'}) // MATCH ()->[rel:`REL`]->()

~~~

### WHERE

- IN

- STARTS WITH

- ENDS WITH

- Regexp

Provide your own custom regexp

~~~js

NB: You need to escape the regexp youself! It might not throw an error but results will be wrong, use built in function

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
