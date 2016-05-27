import Ember from 'ember';
import BusyComponentsInitializer from 'dummy/initializers/busy-components';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | busy components', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  BusyComponentsInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
