const neo4j = require('neo4j-driver').v1
const driver = neo4j.driver(process.env.NEO4J_URL, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS))

const {isArray, isFunction} = require('isnot')
const CypherQuery = require('./CypherQuery')

module.exports = class Neo4jQuery extends CypherQuery{
	constructor(config = {}){
		super(config)
		this.session = driver.session()
	}

	_formatEntity(entity){
		let formattedEntity = {}
		formattedEntity.id = entity.identity.toNumber()
		if(entity.labels && entity.labels.length)
			formattedEntity.labels = entity.labels
		if(entity.type)
			formattedEntity.type = entity.type
		if(entity.start)
			formattedEntity.start = entity.start.toNumber()
		if(entity.end)
			formattedEntity.end = entity.end.toNumber()
		if(entity.segments)
			formattedEntity.segments = entity.segments

		Object.keys(entity.properties).forEach((key) => {
			if(isFunction(entity.properties[key].toNumber)){
				formattedEntity[key] = entity.properties[key].toNumber()
			}else{
				formattedEntity[key] = entity.properties[key]
			}
		})

		return formattedEntity
	}

	_formatRecords(records){
		return records.map(record => this._formatRecord(record))
	}

	_formatRecord(record){
		let formattedRecord = {}
		record.forEach((entity, alias)=>{
			if(isArray(entity)){ //collect
				formattedRecord[alias] = []
				entity.forEach(_entity => {
					formattedRecord[alias].push(this._formatEntity(_entity))
				})
			}else{
				formattedRecord[alias] = this._formatEntity(entity)
			}
		})
		return formattedRecord
	}

	_formatQueryResult(queryResult){
		return this._formatRecords(queryResult.records)
	}

	get(alias){
		return this.session
		.run(
			this.queryString,
			this.queryParams
			)
		.then(queryResult => {
			this.session.close()
			let row = this._formatRecord(queryResult.records[0])
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
		.then(queryResult => {
			this.session.close()
			let formattedResults = this._formatQueryResult(queryResult)
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
		.then(queryResult => {
			this.session.close()
			let formattedResults = this._formatQueryResult(queryResult)

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
		.then(queryResult => {
			this.session.close()
			let formattedResults = this._formatQueryResult(queryResult)

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
		.then(queryResult => {
			this.session.close()
			let formattedResults = this._formatQueryResult(queryResult)
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
		.then(queryResult => {
			this.session.close()
			var formattedResults = this._formatQueryResult(queryResult)
			return formattedResults[formattedResults.length - 1]
		})
		.catch(error => {
			throw error
		})
	}

	run(cb){
		return this.session
		.run(
			this.queryString,
			this.queryParams
		)
		.then(queryResult => {
			if(isFunction(cb))
				cb(queryResult)
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
