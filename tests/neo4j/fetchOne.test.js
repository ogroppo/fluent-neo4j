import test from 'ava';
import Neo4jQuery from '../../class/Neo4jQuery';

const testNodeName = "Test Node"
const testRelType = "Test Rel type"

test('fetchOne default', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: testNodeName}).returnNode()
	return q.fetchOne().then(row => {
		t.is(row.node.name, testNodeName)
	})
});

test('fetchOne alias', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: testNodeName}).returnNode()
	return q.fetchOne('node').then(node => {
		t.is(node.name, testNodeName)
	})
});

test('fetchOne rel', t => {
	var q = new Neo4jQuery()
	q.mergeRel({type: testRelType}).returnRel()
	return q.fetchOne('rel').then(rel => {
		t.is(rel.type, testRelType)
	})
});

test('fetchOne collect rels', t => {
	var q = new Neo4jQuery()
	q.mergeRel({type: testRelType}).return('collect(rel) as rels')
	return q.fetchOne('rels').then(rels => {
		t.is(rels[0].type, testRelType)
	})
});
