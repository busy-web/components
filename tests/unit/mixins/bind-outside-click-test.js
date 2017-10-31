import EmberObject from '@ember/object';
import BindOutsideClickMixin from 'busy-components/mixins/bind-outside-click';
import { module, test } from 'qunit';

module('Unit | Mixin | bind outside click');

// Replace this with your real tests.
test('it works', function(assert) {
  let BindOutsideClickObject = EmberObject.extend(BindOutsideClickMixin);
  let subject = BindOutsideClickObject.create();
  assert.ok(subject);
});
