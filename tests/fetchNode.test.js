import test from 'ava';
import Neo4jQuery from '../index';

const testNodeName = "Test Node"

test.before('cleanup', t => {
	return new Neo4jQuery()
		.matchNode()
		.detachDeleteNode()
		.run()
});

test('fetchNode default', t => {
	return new Neo4jQuery()
		.createNode({name: testNodeName})
		.returnNode()
		.fetchNode().then(node => {
			t.is(node.name, testNodeName)
		})
});
