import test from 'ava';
import Neo4jQuery from '../';

test.before('cleanup', t => {
	return new Neo4jQuery()
		.matchNode({test: 'run'})
		.detachDeleteNode()
		.run()
});

test('run', async t => {
	await new Neo4jQuery().createNode({test: 'run'}).run()
	await new Neo4jQuery().createNode({test: 'run'}).deleteNode().run()

	let nodes = await new Neo4jQuery()
		.matchNode({test: 'run'})
		.returnNode()
		.fetchNodes()
	t.is(nodes.length, 1)
});
