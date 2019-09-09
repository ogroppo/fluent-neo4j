const {isArray, isFunction} = require('isnot')

const driver = require('./driver')
const CypherQuery = require('fluent-cypher')

module.exports = class Neo4jQuery extends CypherQuery{
	constructor(config = {}){
		super(config)
		this.session = driver.session()
	}

	__connected(){
		return this.session;
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

	fetch(){
		return this.fetchRows().then(rows => {
			if(rows.length === 1){
				let firstRow = rows[0]
				let rowKeys = Object.keys(firstRow)
				if(rowKeys.length === 1)
					return firstRow[rowKeys[0]]
				else
					return firstRow
			}else{
				return rows
			}
		})
	}

	fetchNode(){
		return this.fetchRow('node')
	}

	fetchNodes(){
		return this.fetchRows('node')
	}

	fetchParent(){
		return this.fetchRow('parent')
	}

	fetchParents(){
		return this.fetchRows('parent')
	}

	fetchChild(){
		return this.fetchRow('child')
	}

	fetchChildren(){
		return this.fetchRows('child')
	}

	fetchRel(){
		return this.fetchRow('rel')
	}

	fetchRels(){
		return this.fetchRows('rel')
	}

	fetchRow(alias){
		return this.fetchRows(alias).then(rows => rows[0])
	}

	fetchLastRow(alias){
		return this.fetchRows(alias).then(rows => rows[rows.length - 1])
	}

	fetchRows(alias){
		return this.session
		.run(
			this.queryString,
			this.queryParams
			)
		.then(queryResult => {
			this.session.close()
			let formattedResults = this._formatRecords(queryResult.records)
			if(alias)
				return formattedResults.map(row => row[alias])

			return formattedResults
		})
		.catch(error => {
			throw error
		})
	}

	run(){
		if(this.config.debug)
			this.debug()

		return this.session
		.run(
			this.queryString,
			this.queryParams
		)
		.then(queryResult => {
			this.session.close()
			return queryResult
		})
		.catch(error => {
			throw error
		})
	}
}
