import test from 'ava';
import Neo4jQuery from '../index';

const testNodeName = "Test Node"
const testRelType = "Test Rel type"

test('fetchRow default', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: testNodeName}).returnNode()
	return q.fetchRow().then(row => {
		t.is(row.node.name, testNodeName)
	})
});

test('fetchRow alias', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: testNodeName}).returnNode()
	return q.fetchRow('node').then(node => {
		t.is(node.name, testNodeName)
	})
});

test('fetchRow rel', t => {
	var q = new Neo4jQuery()
	q.mergeRel({type: testRelType}).returnRel()
	return q.fetchRow('rel').then(rel => {
		t.is(rel.type, testRelType)
	})
});

test('fetchRow collect rels', t => {
	var q = new Neo4jQuery()
	q.mergeRel({type: testRelType}).return('collect(rel) as rels')
	return q.fetchRow('rels').then(rels => {
		t.is(rels[0].type, testRelType)
	})
});
