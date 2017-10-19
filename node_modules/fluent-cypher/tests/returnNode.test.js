import test from 'ava';
import CypherQuery from '../index';

test('returnNode invalid', t => {
	var query = new CypherQuery;
	t.throws(()=>{
		query.returnNode([]);
	});
	t.throws(()=>{
		query.returnNode({alias: 'nodeAlias'});
	});
});

test('returnNode default', t => {
	var query = new CypherQuery;
	query.returnNode();
	t.is(query.queryString, 'RETURN node ');
});

test('returnNode argument', t => {
	var query = new CypherQuery;
	query.returnNode('klash');
	t.is(query.queryString, 'RETURN klash as node ');
});