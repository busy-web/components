import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bc-checkbox', 'Integration | Component | bc checkbox', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{bc-checkbox}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
	{{#bc-checkbox}}
	  template block text
	{{/bc-checkbox}}
  `);

  assert.equal(this.$().text().trim(), '');
});

test('label should render', function(assert)
{

	this.render(hbs`
		{{bc-checkbox title="check me" value=isChecked}}
	`);
	assert.equal(this.$('span').text(), 'check me');
});

test('value changes on click', function(assert)
{
	this.set('isChecked', false);

	this.render(hbs`
		{{bc-checkbox title="check me" value=isChecked}}
		<h2>{{isChecked}}</h2>
	`);

	assert.equal(this.$('h2').text(), 'false', 'initial value is false');

	this.$('input').click();

	assert.equal(this.$('h2').text(), 'true', 'value changes on click');
});