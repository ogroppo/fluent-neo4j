import test from 'ava';
import Neo4jQuery from '../index';

const testNodeName = "Get all Test Node"

test('fetchRows default', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: testNodeName}).returnNode()
	return q.fetchRows().then(rows => {
		t.is(rows[0].node.name, testNodeName)
	})
});

test('fetchRows alias', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: testNodeName}).returnNode()
	return q.fetchRows('node').then(rows => {
		t.is(rows[0].name, testNodeName)
	})
});

test('fetchRows path rels', t => {
	return new Neo4jQuery()
		.matchPath()
		.return('path')
		.fetchRows('path').then(paths => {
			t.is(typeof paths, "object")
		})
});
