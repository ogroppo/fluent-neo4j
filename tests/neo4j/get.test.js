import test from 'ava';
import Neo4jQuery from '../../class/Neo4jQuery';

const testNodeName = "Test Node"

test('get default', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: testNodeName}).returnNode()
	return q.get().then(row => {
		t.is(row.node.name, testNodeName)
	})
});

test('get alias', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: testNodeName}).returnNode()
	return q.get('node').then(node => {
		t.is(node.name, testNodeName)
	})
});