const neo4j = require('neo4j-driver').v1
const driver = neo4j.driver(process.env.NEO4J_URL, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS))

const {isArray} = require('isnot')
const CypherQuery = require('./CypherQuery')

module.exports = class Neo4jQuery extends CypherQuery{
	constructor(config = {}){
		super(config)
		this.session = driver.session()

		this.userId = config.userId
		this.timestamps = config.timestamps || false
	}

	_formatRecord(record){
		let _record = {}
		_record.id = record.identity.toNumber()
		if(record.labels && record.labels.length)
			_record.labels = record.labels
		if(record.type)
			_record.type = record.type
		if(record.start)
			_record.start = record.start.toNumber()
		if(record.end)
			_record.end = record.end.toNumber()
		if(record.segments)
			_record.segments = record.segments

		Object.keys(record.properties).forEach((key) => {
			if(typeof record.properties[key].toNumber === 'function'){
				_record[key] = record.properties[key].toNumber()
			}else{
				_record[key] = record.properties[key]
			}
		})

		return _record
	}

	_formatQueryResult(queryResult){
		return queryResult.records.map((record)=>{
			let row = {}
			record.forEach((_fields, alias)=>{
				if(isArray(_fields)){ //collect
					row[alias] = []
					_fields.forEach(v => {
						row[alias].push(this._formatRecord(v))
					})
				}else{
					row[alias] = this._formatRecord(_fields)
				}
			})
			return row
		})
	}

	get(alias){
		return this.session
		.run(
			this.queryString,
			this.queryParams
			)
		.then(results => {
			this.session.close()
			let row = this._formatQueryResult(results)[0]
			if(alias)
				return row[alias]

			return row
		})
		.catch(error => {
			throw error
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
			let formattedResults = this._formatQueryResult(results)
			if(alias)
				return formattedResults.map((row)=> row[alias])

			return formattedResults
		})
		.catch(error => {
			throw error
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
			let formattedResults = this._formatQueryResult(results)

			if(formattedResults.length > 1)
				throw "Your query returned more than one node"

			if(formattedResults[0])
				return formattedResults[0].node
		})
		.catch(error => {
			throw error
		})
	}

	getRel(){
		return this.session
		.run(
			this.queryString,
			this.queryParams
			)
		.then(results => {
			this.session.close()
			let formattedResults = this._formatQueryResult(results)

			if(formattedResults.length > 1)
				throw "Your query returned more than one node"

			return formattedResults[0].rel
		})
		.catch(error => {
			throw error
		})
	}

	getFirst(){
		return this.session
		.run(
			this.queryString,
			this.queryParams
			)
		.then(results => {
			this.session.close()
			let formattedResults = this._formatQueryResult(results)
			return formattedResults[0]
		})
		.catch(error => {
			throw error
		})
	}

	getLast(){
		return this.session
		.run(
			this.queryString,
			this.queryParams
			)
		.then(results => {
			this.session.close()
			var formattedResults = this._formatQueryResult(results)
			return formattedResults[formattedResults.length - 1]
		})
		.catch(error => {
			throw error
		})
	}

	run(){
		return this.session
		.run(
			this.queryString,
			this.queryParams
		)
		.then(() => {

		})
		.catch(error => {
			throw error
		})
	}
}

process.on('exit', function () {
	driver.close()
})

// catch ctrl+c event and exit normally
process.on('SIGINT', function () {
	driver.close()
})

process.on('uncaughtException', function (err) {
  	driver.close()
})
