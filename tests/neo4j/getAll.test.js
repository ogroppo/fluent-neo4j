import test from 'ava';
import Neo4jQuery from '../../class/Neo4jQuery';

const testNodeName = "Get all Test Node"

test('get default', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: testNodeName}).returnNode()
	return q.getAll().then(rows => {
		t.is(rows[0].node.name, testNodeName)
	})
});

test('get alias', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: testNodeName}).returnNode()
	return q.getAll('node').then(rows => {
		console.log(rows);
		t.is(rows[0].name, testNodeName)
	})
});

test.only('get path rels', t => {
	var q = new Neo4jQuery().matchPath();
	//cleanup and set up decent data
	q.return('path')
	return q.getAll('path').then(path => {
		t.is(typeof path, "object")
	})
});
