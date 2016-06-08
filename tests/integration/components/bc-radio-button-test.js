import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bc-radio-button', 'Integration | Component | bc radio button', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{bc-radio-button}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
	{{#bc-radio-button}}
	  template block text
	{{/bc-radio-button}}
  `);

  assert.equal(this.$().text().trim(), '');
});

test('click returns true', function(assert)
{
	this.render(hbs`
		{{bc-radio-button }}
	`);

	this.$('input').click();

	assert.throws('true');
});
