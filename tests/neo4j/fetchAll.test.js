import test from 'ava';
import Neo4jQuery from '../../class/Neo4jQuery';

const testNodeName = "Get all Test Node"

test('fetchAll default', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: testNodeName}).returnNode()
	return q.fetchAll().then(rows => {
		t.is(rows[0].node.name, testNodeName)
	})
});

test('fetchAll alias', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: testNodeName}).returnNode()
	return q.fetchAll('node').then(rows => {
		console.log(rows);
		t.is(rows[0].name, testNodeName)
	})
});

test.only('fetchAll path rels', t => {
	var q = new Neo4jQuery().matchPath();
	//cleanup and set up decent data
	q.return('path')
	return q.fetchAll('path').then(path => {
		t.is(typeof path, "object")
	})
});
