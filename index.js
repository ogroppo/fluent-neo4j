const {
	isStringAndNotEmpty, 
	isNotObject, 
	isNotVariableName, 
	isNotString,
	isNotURL
} = require('isnot')
const {formatNode, formatNodeAliasLabels, nodeMetaFields} = require('./lib/node')
const {formatRel, relMetaFields} = require('./lib/rel')
const {formatProps, formatPropKeys, formatPropsParams, formatTimestamp, formatCreatedAt, formatCreatedBy, formatUpdatedAt, formatUpdatedBy, formatMatchedAt, formatMatchCount, formatOrderBy} = require('./lib/props')
const {formatAlias} = require('./lib/alias')
const {formatList} = require('./lib/utils')

const neo4j = require('neo4j-driver').v1
const driver = neo4j.driver(process.env.NEO4J_URL, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS))

module.exports = class Neo4jQuery{
	constructor(config = {}){
		this.session = driver.session()
		this.queryString = ''
		this.queryParams = {}
		this.timestamps = config.timestamps || false
		if(config.userId){
			this.userId = config.userId
			this.queryParams.userId = config.userId
		}
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

	_debug(){
		
		let _queryString = this.queryString.replace(/(\s[A-Z])/g, "\n$1")

		let _queryParams = this.queryParams
		for(let param in _queryParams){
			_queryString = _queryString.replace(`{${param}}`, JSON.stringify(_queryParams[param]) )
		}
	
		return _queryString
	}

	_escapeStringRegexp(string){
		return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
	}

	_getParamKey(propKey, propVal){
		let paramKey = propKey + Object.keys(this.queryParams).length
		this.queryParams[paramKey] = propVal
		return paramKey
	}

	_node(node = {}){
		if(isStringAndNotEmpty(node.label)){	
			node.labels = node.labels || []
			node.labels.push(node.label)
		}

		let paramMap = {}
		for(let nodePropKey in node){
			if(nodeMetaFields.includes(nodePropKey))
				continue

			paramMap[nodePropKey] = this._getParamKey(nodePropKey, node[nodePropKey])
		}

		return formatNode(node, paramMap)
	}

	_rel(rel = {}){
		let paramMap = {}
		for(let relPropKey in rel){
			if(relMetaFields.includes(relPropKey))
				continue

			paramMap[relPropKey] = this._getParamKey(relPropKey, rel[relPropKey])
		}

		return formatRel(rel, paramMap)
	}

	_pattern(parentNode, rel, childNode){
		return this._node(parentNode)+this._rel(rel)+this._node(childNode)
	}

	_getCurrentNodeAlias(alias){
		if(alias && isNotVariableName(alias))
			throw "Not valid node alias"

		let currentNodeAlias = alias || 'node'

		if(!this.nodeAliases){
			this.nodeAliases = [currentNodeAlias]
		}else{
			if(this.nodeAliases.includes(currentNodeAlias)){
				let existingCount = this.nodeAliases.filter((alias) => alias.startsWith(currentNodeAlias)).length
				currentNodeAlias += existingCount
			}
			
			this.nodeAliases.push(currentNodeAlias)
		}

		this.currentAlias = currentNodeAlias
		return currentNodeAlias
	}

	_getCurrentRelAlias(alias){
		if(alias && isNotVariableName(alias))
			throw "Not valid rel alias"

		let currentRelAlias = alias || 'rel'

		if(!this.relAliases){
			this.relAliases = [currentRelAlias]
		}else{
			if(this.relAliases.includes(currentRelAlias)){
				let existingCount = this.relAliases.filter((alias) => alias.startsWith(currentRelAlias)).length
				currentRelAlias += existingCount
			}
			
			this.relAliases.push(currentRelAlias)
		}
		
		this.currentAlias = currentRelAlias
		return currentRelAlias
	}

	_getPreviousNodeAlias(){
		return this.nodeAliases[this.nodeAliases.length - 2]
	}

	and(...args){
		this.where(...args)

		return this
	}

	create(...patterns){
		this.queryString += `CREATE `
		if(patterns.length){
			this.queryString += `${formatList(patterns)} `

		}

		return this
	}

	createNode(node = {}, options = {}){
		if(isNotObject(node))
			throw "createNode: node must be object"

		node.alias = this._getCurrentNodeAlias(node.alias)

		this.create(this._node(node))
		
		if(this.timestamps)
			this.set(formatCreatedAt(node))
		
		return this
	}

	limit(amount){
		if(amount && parseInt(amount)){
			this.queryString += `LIMIT ${parseInt(amount)} `

		}

		return this
	}

	loadCsv(url, options = {}){
		if(isNotURL(url))
			throw "URL is not valid"

		this.queryString += `LOAD CSV `

		if(options.withHeaders)
			this.queryString += `WITH HEADERS `

		let lineAlias = options.lineAlias || 'line'

		this.queryString += `FROM ${JSON.stringify(url)} AS ${lineAlias} `

		return this
	}

	match(...patterns){
		if(patterns.length){
			this.queryString += `MATCH `
			this.queryString += `${formatList(patterns)} `

			this._whereClauseUsed = false
		}

		return this
	}

	matchChild(node = {}, options = {}){

		node.alias = this._getCurrentNodeAlias(node.alias || 'child')

		var previousNode = {alias: this._getPreviousNodeAlias()} 
		
		this.optional(options.optional)
		
		this.match(this._node(previousNode)+this._rel(options.rel)+this._node(node))

		return this
	}	

	matchNode(node = {}, options = {}){
		if(isNotObject(node))
			throw "matchNode: node must be object"

		node.alias = this._getCurrentNodeAlias(node.alias)
		
		this.optional(options.optional)
		this.match(this._node(node))

		let removes = []
		if(options.removeProps)
			removes.push(formatPropKeys(node, options.removeProps))

		if(options.removeLabels)
			removes.push(formatNodeAliasLabels(node, options.removeLabels))

		this.remove(...removes)

		let sets = []
		if(options.setProps)
			sets.push(formatProps(node, options.setProps))

		if(options.setLabels)
			sets.push(formatNodeAliasLabels(node, options.setLabels))

		if(sets.length || removes.length){
			if(this.timestamps)
				sets.push(formatUpdatedAt(node))
			if(this.userId)
				sets.push(formatUpdatedBy(node))
		}

		this.set(...sets)
		
		return this
	}

	matchPath(options = {}){
		
		options.pathAlias = options.pathAlias || 'path'

		options.parentNode = {
			alias: 'parent'
		}

		options.rel = options.rel || {}
		options.rel.depth = options.rel.depth || '*'

		options.childNode = {
			alias: 'child'
		}

		this.match(options.pathAlias + " = "+this._node(options.parentNode)+this._rel(options.rel)+this._node(options.childNode))

		return this
	}

	matchParent(node = {}, options = {}){

		node.alias = this._getCurrentNodeAlias(node.alias || 'parent')

		var previousNode = {alias: this._getPreviousNodeAlias()} 
		
		this.optional(options.optional)
		
		this.match(this._node(node)+this._rel(options.rel)+this._node(previousNode))

		return this
	}

	matchRel(rel = {}, options = {}){
		if(isNotObject(rel))
			throw "matchRel: rel must be object"

		rel.alias = this._getCurrentRelAlias(rel.alias)

		this.optional(options.optional)
		this.match(this._pattern({alias: options.startAlias}, rel, {alias: options.endAlias}))

		let removes = []
		if(options.removeProps)
			removes.push(formatPropKeys(rel, options.removeProps))

		this.remove(...removes)

		let sets = []
		if(options.setProps)
			sets.push(formatProps(rel, options.setProps))

		if(sets.length || removes.length){
			if(this.timestamps)
				sets.push(formatUpdatedAt(rel))
			if(this.userId)
				sets.push(formatUpdatedBy(rel))
		}

		this.set(...sets)

		return this
	}

	merge(...patterns){
		this.queryString += `MERGE `
		if(patterns.length){
			this.queryString += `${formatList(patterns)} `

		}

		return this
	}

	mergeChild(childNode = {}, options = {}){

		childNode.alias = this._getCurrentNodeAlias(childNode.alias || 'child')

		const originNode = {alias: this._getPreviousNodeAlias()}

		this.merge(this._pattern(originNode, options.rel, childNode))
		
		return this
	}

	mergeNode(node = {}, options = {}){
		if(isNotObject(node))
			throw "matchNode: node must be object"

		node.alias = this._getCurrentNodeAlias(node.alias)

		this.merge(this._node(node))

		var onCreateSets = []
		if(this.timestamps)
			onCreateSets.push(formatCreatedAt(node))
		if(this.userId)
			onCreateSets.push(formatCreatedBy(node))
		if(options.onCreateSet)
			onCreateSets.push(formatProps(node, options.onCreateSet))
		this.onCreateSet(...onCreateSets)

		let removes = []
		if(options.removeProps)
			removes.push(formatPropKeys(node, options.removeProps))
		if(options.removeLabels)
			removes.push(formatNodeAliasLabels(node, options.removeLabels))
		this.remove(...removes)

		let sets = []
		if(options.setProps)
			sets.push(formatProps(node, options.setProps))
		if(options.setLabels)
			sets.push(formatNodeAliasLabels(node, options.setLabels))
		if(sets.length || removes.length){
			if(this.timestamps)
				sets.push(formatUpdatedAt(node))
			if(this.userId)
				sets.push(formatUpdatedBy(node))
		}
		this.set(...sets)
		
		return this
	}

	mergeParent(node = {}, options = {}){

		node.alias = this._getCurrentNodeAlias(node.alias || 'parent')

		const originNode = {alias: this._getPreviousNodeAlias()}

		this.merge(this._node(node)+this._rel(options.rel)+this._node(originNode))
		
		return this
	}

	mergeRel(rel, options = {}){ //it is only a contextual clause
		if(isNotObject(rel))
			throw "mergeRel: rel must be object"

		if(!rel.type)
			throw "mergeRel: rel must have type"

		rel.alias = this._getCurrentRelAlias(rel.alias)
		
		this.merge(this._node({alias: options.parentAlias})+this._rel(rel)+this._node({alias: options.childAlias}))
		
		var onMatchSets = [formatMatchedAt(rel), formatMatchCount(rel)]
		if(options.onMatchSet)
			onMatchSets.push(formatProps(rel, options.onMatchSet))
		this.onMatchSet(...onMatchSets)

		var onCreateSets = [formatCreatedAt(rel)]
		if(options.onCreateSet)
			onCreateSets.push(formatProps(rel, options.onCreateSet))
		
		this.onCreateSet(...onCreateSets)

		var sets = []
		if(options.set)
			sets.push(formatProps(rel, options.set))
		
		this.set(...sets)

		return this
	}

	onCreateSet(...props){
		if(props.length){
			this.queryString += `ON CREATE SET ${formatList(props)} `

		}

		return this
	}

	onMatchSet(...props){
		if(props.length){
			this.queryString += `ON MATCH SET ${formatList(props)} `

		}

		return this
	}

	optional(optional){
		if(optional)
			this.queryString += `OPTIONAL `

		return this
	}

	optionalMatchNode(node = {}, options = {}){
		options.optional = true
		this.matchNode(node, options)
	}

	optionalMatchRel(rel = {}, options = {}){
		options.optional = true
		this.matchRel(rel, options)
	}

	or(...args){
		if(args.length){
			if(!this._whereClauseUsed){
				this.queryString += `WHERE `
				this._whereClauseUsed = true
			}else{
				this.queryString += `OR `
			}

			this.queryString += `${formatList(args, ' OR ')} `

		}

		return this
	}

	orderBy(...props){
		if(props.length){
			this.queryString += `ORDER BY ${formatOrderBy(props)} `

		}

		return this
	}

	remove(...props){
		if(props.length){
			this.queryString += `REMOVE ${formatList(props)} `

		}

		return this
	}

	return(...aliases){
		if(aliases.length){
			this.queryString += `RETURN ${formatAlias(aliases)} `
		}

		return this
	}

	returnAll(){
		this.queryString += `RETURN * `

		return this
	}

	returnDistinct(...aliases){
		if(aliases.length){
			this.queryString += `RETURN DISTINCT ${formatAlias(aliases)} `
		}

		return this
	}

	returnNode(nodeAlias = ''){
		if(isNotString(nodeAlias))
			throw "Error: returnNode - nodeAlias must be string"

		this.queryString += `RETURN `
		if(nodeAlias)
			this.queryString += `${nodeAlias} as `

		this.queryString += `node `

		return this
	}

	returnRel(relAlias = ''){
		if(isNotString(relAlias))
			throw "Error: returnRel - relAlias must be string"

		this.queryString += `RETURN `
		if(relAlias)
			this.queryString += `${relAlias} as `

		this.queryString += `rel `

		return this
	}

	set(...props){
		if(props.length){
			this.queryString += `SET ${formatList(props)} `

		}

		return this
	}

	skip(amount){
		if(amount && parseInt(amount)){
			this.queryString += `SKIP ${parseInt(amount)} `

		}

		return this
	}

	union(){
		this.queryString += `UNION `

		return this
	}

	unionAll(){
		this.queryString += `UNION ALL `

		return this
	}

	where(...args){
		if(args.length){
			if(!this._whereClauseUsed){
				this.queryString += `WHERE `
				this._whereClauseUsed = true
			}else{
				this.queryString += `AND `
			}

			this.queryString += `${formatList(args, ' AND ')} `

		}

		return this
	}

	whereProp(prop){
		if(prop){
			this.where(formatProps({alias: this.currentAlias}, prop))
		}

		return this
	}

	wherePropGreater(prop){
		if(prop){
			this.where(formatProps({alias: this.currentAlias}, prop, ">"))
		}

		return this
	}

	wherePropIn(prop){
		if(prop){
			this.where(formatProps({alias: this.currentAlias}, prop, "IN"))
		}

		return this
	}

	wherePropRegexp(props){
		if(props){
			let a = []
			for(let propKey in props){
				a.push(`${this.currentAlias}.${propKey} =~ {${this._getParamKey(propKey, props[propKey])}}`)
			}

			this.where(...a)
		}

		return this
	}

	with(...args){
		if(args.length){
			this.queryString += `WITH ${formatList(args)} `

		}

		return this
	}

	xor(...args){
		if(args.length){
			if(!this._whereClauseUsed){
				this.queryString += `WHERE `
				this._whereClauseUsed = true
			}else{
				this.queryString += `XOR `
			}

			this.queryString += `${formatList(args, ' XOR ')} `

		}

		return this
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