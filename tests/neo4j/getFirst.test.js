import test from 'ava';
import Neo4jQuery from '../../class/Neo4jQuery';

const testNodeName = Math.random()

test.beforeEach('cleanup', t => {
	var q = new Neo4jQuery()
	q.matchNode()
	q.detachDeleteNode()
	return q.run()
});

test.beforeEach('create', t => {
	var q = new Neo4jQuery()
	q.createNode({label: 'getFirst', name: 'first'})
	q.createNode({label: 'getFirst', name: testNodeName})
	q.returnNode('node')
	return q.getNode().then(node => {
		t.context.firstNodeId = node.id
	})
});

test('getFirst default', t => {
	var q = new Neo4jQuery()
	q.matchNode({label: 'getFirst'})
	q.returnNode()
	return q.getFirst().then(row => {
		t.is(row.node.id, t.context.firstNodeId)
	})
});
