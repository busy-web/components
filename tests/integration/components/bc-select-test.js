import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bc-select', 'Integration | Component | bc select', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
	this.set('model', [
		Ember.Object.create({key: 1, value: 10}),
		Ember.Object.create({key: 2, value: 20}),
		Ember.Object.create({key: 3, value: 30})
	]);

  this.render(hbs`{{bc-select model=model itemLabel="key"}}`);

  assert.notEqual(this.$().text().trim().length, 0);
});
