import test from 'ava';
import Neo4jQuery from '../index';

test('get default', t => {
	var q = new Neo4jQuery()
	q.matchNode({name: "Cristo"}).returnNode()
	return q.get().then(row => {
		t.is(row.node.name, "Cristo")
	})
});

test('get alias', t => {
	var q = new Neo4jQuery()
	q.matchNode({name: "Cristo"}).returnNode()
	return q.get('node').then(node => {
		t.is(node.name, "Cristo")
	})
});