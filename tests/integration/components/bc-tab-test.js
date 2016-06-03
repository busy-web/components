import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bc-tab', 'Integration | Component | bc tab', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{bc-tab}}`);

  assert.equal(this.$().text().trim(), '+');

  // Template block usage:
  this.render(hbs`
	{{#bc-tab}}
	  template block text
	{{/bc-tab}}
  `);

  // assert.equal(this.$().text().trim(), '');
});
