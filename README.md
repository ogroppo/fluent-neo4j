# Fluent Neo4j

## All the tools you need to communicate with the database, in a fluent API

Refer to the documentation of [fluent-cypher](https://github.com/ogroppo/fluent-cypher/blob/master/README.md) for query building.

You'll need to set env params to connect to neo4j

e.g.

~~~sh

export NEO4J_URL="bolt://localhost"
export NEO4J_USER="neo4j"
export NEO4J_PASS="neo4j"

npm start

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