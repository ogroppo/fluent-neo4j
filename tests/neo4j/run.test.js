import test from 'ava';
import Neo4jQuery from '../../class/Neo4jQuery';

const testNodeName = Math.random()

test.beforeEach('create', t => {
	var q = new Neo4jQuery()
	q.createNode({name: testNodeName})
	q.deleteNode()
	return q.run()
});

test('run', t => {
	var q = new Neo4jQuery()
	q.matchNode({name: testNodeName})
	q.returnNode()
	return q.fetchNode().then(node => {
		t.is(node, undefined)
	})
});
