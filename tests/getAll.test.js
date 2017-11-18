import test from 'ava';
import Neo4jQuery from '../index';

test('get default', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: "Cristo"}).returnNode()
	return q.getAll().then(rows => {
		t.is(rows[0].node.name, "Cristo")
	})
});

test('get alias', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: "Cristo"}).returnNode()
	return q.getAll('node').then(rows => {
		t.is(rows[0].name, "Cristo")
	})
});