import Ember from 'ember';
import BindOutsideClickMixin from 'busy-components/mixins/bind-outside-click';
import { module, test } from 'qunit';

module('Unit | Mixin | bind outside click');

// Replace this with your real tests.
test('it works', function(assert) {
  let BindOutsideClickObject = Ember.Object.extend(BindOutsideClickMixin);
  let subject = BindOutsideClickObject.create();
  assert.ok(subject);
});
