import test from 'ava';
import Neo4jQuery from '../index';

test('fetchChild', t => {
	return new Neo4jQuery()
		.createNode({label: 'fetchChild'})
		.mergeChild({name: 'childName', rel: {type: 'has'}})
		.returnChild()
		.fetchChild().then(child => {
			t.is(child.name, 'childName')
		})
});
