import test from 'ava';
import Neo4jQuery from '../../class/Neo4jQuery';

test.beforeEach('create', t => {
	var q = new Neo4jQuery()
	q.createNode({prop: 'getLast'})
	q.createNode({prop: 'getLast'})
	q.returnNode('node1')
	return q.fetchNode().then(node => {
		t.context.lastNodeId = node.id
	})
});

test('getLast default', t => {
	var q = new Neo4jQuery()
	q.matchNode({prop: 'getLast'})
	q.returnNode()
	return q.getLast().then(row => {
		t.is(row.node.id, t.context.lastNodeId)
	})
});
