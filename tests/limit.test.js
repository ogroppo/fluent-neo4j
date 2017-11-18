import test from 'ava';
import CypherQuery from '../index';

test('limit default', t => {
	t.is(new CypherQuery().limit().queryString, '')
	t.is(new CypherQuery().limit(0).queryString, '')
	t.is(new CypherQuery().limit(0.0).queryString, '')
	t.is(new CypherQuery().limit('0').queryString, '')
	t.is(new CypherQuery().limit(null).queryString, '')
	t.is(new CypherQuery().limit(undefined).queryString, '')
});

test('limit clause', t => {
	t.is(new CypherQuery().limit(1).queryString, 'LIMIT 1 ')
	t.is(new CypherQuery().limit('33').queryString, 'LIMIT 33 ')
	t.is(new CypherQuery().limit('33.33').queryString, 'LIMIT 33 ')
});