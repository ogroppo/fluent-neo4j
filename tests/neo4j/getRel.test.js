import test from 'ava';
import Neo4jQuery from '../../class/Neo4jQuery';

const relRandomProp = Math.random()

test('fetchRel default', t => {
	var q = new Neo4jQuery()
	q.mergeRel({type: 'has', relRandomProp: relRandomProp}).returnRel()
	return q.fetchRel().then(rel => {
		t.is(rel.relRandomProp, relRandomProp)
	})
});
