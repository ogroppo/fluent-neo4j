import test from 'ava';
import Neo4jQuery from '../';

const config = {
  defaultNodeProps: {
    realm: 'fetch-test'
  }
}

test.before('cleanup', t => {
	return new Neo4jQuery(config)
		.match({$: 'nodes'})
		.detachDelete('nodes')
		.run()
});

test('fetch', async t => {
  await new Neo4jQuery(config)
    .create({k: 1, label: 'fetch'})
    .create({k: 2, label: 'fetch'})
    .create({k: 3, label: 'fetch'})
    .run()

	let nodes = await new Neo4jQuery(config)
		.match({$: 'fetchNode', label: 'fetch'})
    .return('*')
    .orderBy({$: 'fetchNode', k: 'ASC'})
    .fetch()
    
	t.is(nodes.length, 3)
	t.is(nodes[0].fetchNode.k, 1)
});