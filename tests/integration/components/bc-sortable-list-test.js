import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('bc-sortable-list', 'Integration | Component | bc sortable list', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
	this.set('model', [
		Ember.Object.create({name: 'Bob Thomas', occupation: 'bullfighter', age: 32}),
		Ember.Object.create({name: 'John Smith', occupation: 'astronaut', age: 39})
	]);

	this.set('meta', [
		{header: 'name', sortable: false},
		{header: 'occupation', sortable: false},
		{header: 'age', sortable: false}
	]);

  this.render(hbs`{{bc-sortable-list model=model meta=meta}}`);

  assert.notEqual(this.$().text().trim().length, 0);
});
