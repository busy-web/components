import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bc-tab', 'Integration | Component | bc tab', {
  integration: true
});

test('it renders', function(assert) {
  // Template block usage:
  this.render(hbs`
		{{#bc-tab tabName="test"}}
			template block text
		{{/bc-tab}}
  `);

  assert.equal(this.$().text().trim(), '');
});
