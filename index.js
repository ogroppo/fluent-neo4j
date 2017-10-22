var CypherQuery = require('fluent-cypher')
var neo4j = require('neo4j-driver').v1
var driver = neo4j.driver(process.env.NEO4J_URL, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS))

class Neo4jQuery extends CypherQuery{
	constructor(config = {}){
		super(config)
		this.session = driver.session()
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

	_formatResult(result){
		return result.records.map((record)=>{
			let _record = {}
			record.forEach((value, key, record)=>{
				if(Array.isArray(value)){
					_record[key] = []
					value.forEach(v => {
						_record[key].push(this._formatRecord(v))
					})
				}else{
					_record[key] = this._formatRecord(value)
				}
			})
			return _record
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
}

module.exports.Neo4jQuery = Neo4jQuery

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