import Ember from 'ember';
import HelpMixin from 'busy-components/mixins/help';
import { module, test } from 'qunit';

module('Unit | Mixin | help');

// Replace this with your real tests.
test('it works', function(assert) {
  let HelpObject = Ember.Object.extend(HelpMixin);
  let subject = HelpObject.create();
  assert.ok(subject);
});
