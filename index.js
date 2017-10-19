var CypherQuery = require('fluent-cypher');
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neo1313"));

class Neo4jQuery extends CypherQuery{
	constructor(config = {}){
		super(config)
		this.session = driver.session();
	}

	_format(record){
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

		return _record;
	}

	_query(){
		var startTime = new Date();
		return this.session
		.run(
			this.queryString,
			this.queryParams
			)
		.then(result => {
			var r = result.records.map((record)=>{
				let _record = {}
				record.forEach((value, key, record)=>{
					if(Array.isArray(value)){
						_record[key] = [];
						value.forEach(v => {
							_record[key].push(this._format(v))
						})
					}else{
						_record[key] = this._format(value)
					}
				})
				return _record;
			})

			console.log(new Date() - startTime);
			this.session.close();
			return r;
		})
		.catch(error => {
			console.log('error', error)
			this.session.close();
		});
	}

	async get(cb){
		try{
			let r = await this._query();
			return r
		}catch(err){
			return err;
		}
	}
}

var query = new Neo4jQuery()
			.matchNode({name: 'Cristo'})
			.returnNode().get();


console.log('query', query)

process.on('exit', function () {
	driver.close();
	console.log("exiting")
});

// catch ctrl+c event and exit normally
process.on('SIGINT', function () {
	console.log('Ctrl-C...');
	driver.close();
});