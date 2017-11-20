import test from 'ava';
import CypherQuery from '../index';

test('Merge invalid node throws error', t => {
	var query = new CypherQuery;
	t.throws(()=>{
		query.mergeNode(['invalid'])
	});
	t.throws(()=>{
		query.mergeNode(null)
	});
});

test('Merge empty node and concatenation', t => {
	var query = new CypherQuery;
	query.mergeNode();
	query.mergeNode();
	t.is(query.queryString, 'MERGE (node) MERGE (node1) ');
});

test('Merge node with all arguments', t => {
	var query = new CypherQuery({timestamps: true, userId: 13});
	query.mergeNode(
		{alias: 'box', label: 'Box', labels: ['hey', 'you too'], type: 'content'},
		{setProps: {cane: 'morto'}, removeProps: ['ladro'], setLabels: ['Bimbo'], removeLabels: ['GG', 'SS']}
	);
	t.is(query.queryString,
'MERGE (box:`hey`:`you too`:`Box` {type:{type0}}) \
ON CREATE SET box.createdAt = timestamp(), box.createdBy = 13 \
REMOVE box.ladro, box:`GG`:`SS` SET box.cane = {cane1}, box:`Bimbo`, box.updatedAt = timestamp(), box.updatedBy = 13 ');
	t.deepEqual(query.queryParams, {type0: 'content', cane1: 'morto'});
});