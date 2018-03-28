import test from 'ava';
import Neo4jQuery from '../index';

test('fetchLastRow default', async t => {
	let lastNode = await new Neo4jQuery()
		.createNode({prop: 'fetchLastRow'})
		.createNode({prop: 'fetchLastRow'})
		.returnNode('node1')
		.fetchNode()

	return new Neo4jQuery()
		.matchNode({prop: 'fetchLastRow'})
		.returnNode()
		.fetchLastRow().then(row => {
			t.is(row.node.id, lastNode.id)
		})
});
