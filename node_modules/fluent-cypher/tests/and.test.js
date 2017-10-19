import test from 'ava';
import CypherQuery from '../index';

test('and default', t => {
	t.is(new CypherQuery().and().queryString, '')
});

test('and rest args', t => {
	t.is(new CypherQuery().and('custom.prop = "ciao"', 'n:Label').queryString, `WHERE custom.prop = "ciao" AND n:Label `)
});

test('and chain', t => {
	t.is(new CypherQuery().and('custom.prop = "ciao"').and('n:Label').queryString, `WHERE custom.prop = "ciao" AND n:Label `)
});