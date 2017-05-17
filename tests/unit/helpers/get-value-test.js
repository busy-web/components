
import { getValue } from 'dummy/helpers/get-value';
import { module, test } from 'qunit';

module('Unit | Helper | get value');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = getValue([{test:"test"}, "test"]);
  assert.ok(result === "test");
});

