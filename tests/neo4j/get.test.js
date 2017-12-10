import test from 'ava';
import Neo4jQuery from '../../class/Neo4jQuery';

const testNodeName = "Test Node"
const testRelType = "Test Rel type"

test('get default', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: testNodeName}).returnNode()
	return q.get().then(row => {
		t.is(row.node.name, testNodeName)
	})
});

test('get alias', t => {
	var q = new Neo4jQuery()
	q.mergeNode({name: testNodeName}).returnNode()
	return q.get('node').then(node => {
		t.is(node.name, testNodeName)
	})
});

test('get rel', t => {
	var q = new Neo4jQuery()
	q.mergeRel({type: testRelType}).returnRel()
	return q.get('rel').then(rel => {
		t.is(rel.type, testRelType)
	})
});

test('get collect rels', t => {
	var q = new Neo4jQuery()
	q.mergeRel({type: testRelType}).return('collect(rel) as rels')
	return q.get('rels').then(rels => {
		t.is(rels[0].type, testRelType)
	})
});
