import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bc-sortable-list', 'Integration | Component | bc sortable list', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
	this.set('model', [
		{name: 'Bob Thomas', occupation: 'bullfighter', age: 32},
		{name: 'John Smith', occupation: 'astronaut', age: 39}
	]);

	this.set('meta', [
		{header: 'name', sortable: false},
		{header: 'occupation', sortable: false},
		{header: 'age', sortable: false}
	]);

  this.render(hbs`{{bc-sortable-list model=model meta=meta}}`);

  assert.notEqual(this.$().text().trim().length, 0);
});
