const {isArray, isFunction} = require('isnot')

const driver = require('../driver')
const CypherQuery = require('./CypherQuery')

module.exports = class Neo4jQuery extends CypherQuery{
	constructor(config = {}){
		super(config)
		this.session = driver.session()
	}

	_formatNode(node){
		var formattedNode = {}
		formattedNode.id = node.identity.toNumber()
		formattedNode.labels = node.labels
		Object.assign(formattedNode, this._formatProperties(node.properties))
		return formattedNode
	}

	_formatRel(rel){
		var formattedRel = {}
		formattedRel.id = rel.identity.toNumber()
		formattedRel.type = rel.type
		formattedRel.start = rel.start.toNumber()
		formattedRel.end = rel.end.toNumber()
		Object.assign(formattedRel, this._formatProperties(rel.properties))
		return formattedRel
	}

	_formatInteger(integer){
		return integer.toNumber()
	}

	_formatProperties(properties){
		var formattedProperties = {}
		Object.keys(properties).forEach((key) => {
			if(properties[key].constructor.name === 'Integer'){
				formattedProperties[key] = this._formatInteger(properties[key])
			}else{
				formattedProperties[key] = properties[key]
			}
		})
		return formattedProperties
	}

	_formatPath(path){
		var formattedPath = {}
		formattedPath.start = this._formatNode(path.start)
		formattedPath.end = this._formatNode(path.end)
		formattedPath.segments = path.segments.map((segment)=>{
			return {
				start: this._formatNode(segment.start),
				end: this._formatNode(segment.end),
				relationship: this._formatRel(segment.relationship),
			}
		})
		return formattedPath
	}

	_formatEntity(entity){
		let formattedEntity = {}
		switch (entity.constructor.name) {
			case "Integer":
				formattedEntity = this._formatInteger(entity)
				break;
			case "Node":
				formattedEntity = this._formatNode(entity)
				break;
			case "Relationship":
				formattedEntity = this._formatRel(entity)
				break;
			case "Path":
				formattedEntity = this._formatPath(entity)
				break;
		}

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

	fetchOne(alias){
		return this.session
		.run(
			this.queryString,
			this.queryParams
			)
		.then(queryResult => {
			this.session.close()

			if(!queryResult.records.length)
				return

			let row = this._formatRecord(queryResult.records[0])
			if(alias)
				return row[alias]

			return row
		})
		.catch(error => {
			throw error
		})
	}

	fetchAll(alias){
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

	fetchNode(){
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

	fetchRel(){
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
