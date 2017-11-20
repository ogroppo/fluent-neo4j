const neo4j = require('neo4j-driver').v1
const driver = neo4j.driver(process.env.NEO4J_URL, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS))

const CypherQuery = require('./CypherQuery')

module.exports = class Neo4jQuery extends CypherQuery{
	constructor(config = {}){
		super(config)
		this.session = driver.session()

		this.timestamps = config.timestamps || false
		this.userId = config.userId
	}

	get(alias){
		return this.session
		.run(
			this.queryString,
			this.queryParams
			)
		.then(results => {
			this.session.close()
			let row = this._formatResult(results)[0]
			if(alias)
				return row[alias]

			return row
		})
		.catch(error => {
			console.log(error)
		})
	}

	getAll(alias){
		return this.session
		.run(
			this.queryString,
			this.queryParams
			)
		.then(results => {
			this.session.close()
			let formattedResults = this._formatResult(results)
			if(alias)
				return formattedResults.map((row)=> row[alias])

			return formattedResults
		})
		.catch(error => {
			console.log(error)
		})
	}

	getNode(){
		return this.session
		.run(
			this.queryString,
			this.queryParams
			)
		.then(results => {
			this.session.close()
			return this._formatResult(results)[0].node
		})
		.catch(error => {
			console.log(error)
		})
	}

	getRel(){
		return this.session
		.run(
			this.queryString,
			this.queryParams
			)
		.then(result => {
			this.session.close()
			return this._formatResult(results)[0].rel
		})
		.catch(error => {
			console.log(error)
		})
	}

	getFirst(){
		return this.session
		.run(
			this.queryString,
			this.queryParams
			)
		.then(result => {
			this.session.close()
			return this._formatResult(result)[0]
		})
		.catch(error => {
			console.log(error)
		})
	}

	getLast(){
		return this.session
		.run(
			this.queryString,
			this.queryParams
			)
		.then(result => {
			this.session.close()
			var formattedResults = this._formatResult(result)
			return formattedResults[formattedResults.length - 1]
		})
		.catch(error => {
			console.log(error)
		})
	}

	run(){
		return this.session
		.run(
			this.queryString,
			this.queryParams
		)
		.catch(error => {
			console.log(error)
		})
	}
}