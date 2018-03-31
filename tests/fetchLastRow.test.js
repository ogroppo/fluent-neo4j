import test from 'ava';
import Neo4jQuery from '../index';

test.before('cleanup', async t => {
	await new Neo4jQuery()
		.matchNode({file: 'fetchLastRow'})
		.detachDeleteNode()
		.run()
});

test('fetchLastRow', async t => {
	let lastNode = await new Neo4jQuery()
		.createNode({test: 'fetchLastRow', file: 'fetchLastRow'})
		.createNode({test: 'fetchLastRow', file: 'fetchLastRow'})
		.returnNode()
		.fetchNode()

	return new Neo4jQuery()
		.matchNode({test: 'fetchLastRow'})
		.returnNode()
		.fetchLastRow().then(row => {
			t.is(row.node.id, lastNode.id)
		})
});

test('fetchLastRow orderBy', async t => {
	let lastNode = await new Neo4jQuery()
		.createNode({name: 'A', test: 'fetchLastRow orderBy', file: 'fetchLastRow'})
		.createNode({alias: 'last', name: 'C', test: 'fetchLastRow orderBy', file: 'fetchLastRow'})
		.createNode({name: 'B', test: 'fetchLastRow orderBy', file: 'fetchLastRow'})
		.returnNode('last')
		.fetchNode()

	return new Neo4jQuery()
		.matchNode({test: 'fetchLastRow orderBy'})
		.returnNode()
		.orderBy('node.name')
		.fetchLastRow('node').then(last => {
			t.is(last.id, lastNode.id)
		})
});
