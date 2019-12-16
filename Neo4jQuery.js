const CypherQuery = require('fluent-cypher')
const {isArray} = require('isnot')
const driver = require('./driver')

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
    if(!entity || !entity.constructor || !entity.constructor.name)
      return entity

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
      default:
        formattedEntity = entity
		}

		return formattedEntity
	}

	_formatRecords(records, extractAlias){
		return records.map(record => this._formatRecord(record, extractAlias))
	}

	_formatRecord(record, extractAlias){
		let formattedRecord = {}
		record.forEach((entity, alias)=>{
			if(extractAlias && extractAlias !== alias)
				return

			if(isArray(entity)){ //collect
				if(extractAlias)
					formattedRecord = entity.map(_entity => this._formatEntity(_entity))
				else
					formattedRecord = entity.map(_entity => this._formatEntity(_entity))
			}else{
				if(extractAlias)
					formattedRecord = this._formatEntity(entity)
				else
					formattedRecord[alias] = this._formatEntity(entity)
			}
		})
		return formattedRecord
	}

	fetchOne(extractAlias){
    return this.session
		.run(
			this.queryString,
			this.queryParams
		)
		.then(queryResult => {
			this.session.close()
			let formattedResult = this._formatRecord(queryResult.records.slice(0, 1)[0], extractAlias)

			return formattedResult
		})
		.catch(error => {
			throw error
		})
	}

	fetch(extractAlias){
		return this.session
		.run(
			this.queryString,
			this.queryParams
		)
		.then(queryResult => {
			this.session.close()
			let formattedResults = this._formatRecords(queryResult.records, extractAlias)

			return formattedResults
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
		.then(queryResult => {
			this.session.close()
			return queryResult
		})
		.catch(error => {
			throw error
		})
	}
}
