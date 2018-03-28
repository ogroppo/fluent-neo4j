import test from 'ava';
import Neo4jQuery from '../index';

const relRandomProp = Math.random()

test('fetchRel default', t => {
	return new Neo4jQuery()
		.mergeRel({type: 'has', relRandomProp: relRandomProp})
		.returnRel()
		.fetchRel().then(rel => {
			t.is(rel.relRandomProp, relRandomProp)
		})
});
