import EmberObject from '@ember/object';
import CloseOnEscapeMixin from '@busy-web/components/mixins/close-on-escape';
import { module, test } from 'qunit';

module('Unit | Mixin | close on escape');

// Replace this with your real tests.
test('it works', function(assert) {
  let CloseOnEscapeObject = EmberObject.extend(CloseOnEscapeMixin);
  let subject = CloseOnEscapeObject.create();
  assert.ok(subject);
});
