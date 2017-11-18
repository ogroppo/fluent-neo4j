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

test('Merge empty node and current alias', t => {
	var query = new CypherQuery;
	query.mergeNode();
	query.mergeNode();
	t.is(query.queryString, 'MERGE (node) MERGE (node1) ');
});

test('Merge node with alias, label, labels, properties, reserved field, set options, remove options', t => {
	var query = new CypherQuery({timestamps: true, userId: 13});
	query.mergeNode(
		{alias: 'box', label: 'Box', labels: ['hey', 'you too'], type: 'content'},
		{setProps: {cane: 'morto'}, removeProps: ['ladro'], setLabels: ['Bimbo'], removeLabels: ['GG', 'SS']}
	);
	t.is(query.queryString,
'MERGE (box:`hey`:`you too`:`Box` {type:{type1}}) \
ON CREATE SET box.createdAt = timestamp(), box.createdBy = {userId} \
REMOVE box.ladro, box:`GG`:`SS` SET box.cane = "morto", box:`Bimbo`, box.updatedAt = timestamp(), box.updatedBy = {userId} ');
	t.deepEqual(query.queryParams, {userId: 13, type1: 'content'});
});