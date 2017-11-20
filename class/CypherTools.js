const {
	isStringAndNotEmpty, 
	isNotVariableName, 
} = require('isnot')
const {formatNode, nodeMetaFields} = require('../lib/node')
const {formatRel, relMetaFields} = require('../lib/rel')

module.exports = class CypherTools{
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

	_formatPropsParams(alias, props, operator = "=", divider = ", ") {
		var a = []
		for (var key in props) {
			a.push(`${alias}.${key} ${operator} {${this._getParamKey(key, props[key])}}`);
		}

		return a.join(divider)
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
}