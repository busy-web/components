import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bc-select-menu', 'Integration | Component | bc select menu', {
  integration: true
});

test('it renders', function(assert) {

  // Template block usage:
  this.render(hbs`
    {{#bc-select-menu label="Select"}}
			<option value="one">One</option>
			<option value="two">Two</option>
    {{/bc-select-menu}}
  `);

  assert.notEqual(this.$().text().trim().length, 0);
});
