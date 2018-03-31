import test from 'ava';
import Neo4jQuery from '../index';

test.before('cleanup', t => {
	return new Neo4jQuery()
		.matchNode({test: 'fetchNode'})
		.detachDeleteNode()
		.run()
});

test('fetchNode', t => {
	return new Neo4jQuery()
		.createNode({test: 'fetchNode'})
		.returnNode()
		.fetchNode().then(node => {
			t.is(node.name, testNodeName)
		})
});
