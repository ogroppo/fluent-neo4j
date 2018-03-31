import test from 'ava';
import Neo4jQuery from '../index';

test('fetchParent', t => {
	return new Neo4jQuery()
		.createNode({label: 'fetchParent'})
		.mergeParent({name: 'parentName', rel: {type: 'has'}})
		.returnParent()
		.fetchParent().then(parent => {
			t.is(parent.name, 'parentName')
		})
});
