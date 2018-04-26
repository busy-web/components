import EmberObject from '@ember/object';
import TabRouteMixin from '@busy-web/components/mixins/tab-route';
import { module, test } from 'qunit';

module('Unit | Mixin | tab route');

// Replace this with your real tests.
test('it works', function(assert) {
  let TabRouteObject = EmberObject.extend(TabRouteMixin);
  let subject = TabRouteObject.create();
  assert.ok(subject);
});
