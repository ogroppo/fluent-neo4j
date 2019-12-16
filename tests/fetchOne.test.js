import test from 'ava';
import Neo4jQuery from '../';

const config = {
  defaultNodeProps: {
    realm: 'fetch-one-test'
  }
}

test.before('cleanup', t => {
	return new Neo4jQuery(config)
		.match({$: 'nodes'})
		.detachDelete('nodes')
		.run()
});

test('fetchOne', async t => {
  await new Neo4jQuery(config)
    .merge({k: 1, int: 12312313, string: 'string', array: [], label: 'fetchOne'})
    .create({k: 2, int: 12312313, label: 'fetchOne'})
    .create({k: 3, array: [], label: 'fetchOne'})
    .run()

	let node = await new Neo4jQuery(config)
		.match({$: 'fetchOneNode', label: 'fetchOne'})
		.return('*')
    .fetchOne('fetchOneNode')
      
	t.is(node.labels.length, 1)
	t.is(node.k, 1)
	t.is(node.string, 'string')
	t.is(node.int, 12312313)
	t.deepEqual(node.array, [])
});