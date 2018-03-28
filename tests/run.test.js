import test from 'ava';
import Neo4jQuery from '../';

const testNodeName = Math.random()

test('run', async t => {
	await new Neo4jQuery().createNode({name: testNodeName}).deleteNode().run()

	let node = await new Neo4jQuery()
		.matchNode({name: testNodeName})
		.returnNode()
		.fetchNode()
	t.is(node, undefined)
});
