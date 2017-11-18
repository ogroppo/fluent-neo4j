import test from 'ava';
import Neo4jQuery from '../index';

const testNodeName = "Get all Test Node"

test('get default', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: testNodeName}).returnNode()
	return q.getAll().then(rows => {
		t.is(rows[0].node.name, testNodeName)
	})
});

test('get alias', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: testNodeName}).returnNode()
	return q.getAll('node').then(rows => {
		t.is(rows[0].name, testNodeName)
	})
});