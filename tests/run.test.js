import test from 'ava';
import Neo4jQuery from '../';

const config = {
  defaultNodeProps: {
    realm: 'run-test'
  }
}

test.before('cleanup', t => {
	return new Neo4jQuery(config)
		.match({$: 'nodes'})
		.detachDelete('nodes')
		.run()
});

test('run', async t => {
	await new Neo4jQuery(config).create({test: 'run'}).run()
	await new Neo4jQuery(config).create({$: 'node', test: 'run2'}).delete('node').run()

	let nodes = await new Neo4jQuery(config)
		.match({$: 'node', test: 'run'})
		.return('*')
		.fetch()
	t.is(nodes.length, 1)
});
