import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bc-input', 'Integration | Component | bc input', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{bc-input}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
	{{#bc-input}}
	  template block text
	{{/bc-input}}
  `);

  assert.equal(this.$().text().trim(), '');
});

test('click returns false', function(assert)
{
	this.render(hbs`
		{{bc-input}}
	`);

	this.$('input').click();

	assert.throws('false');
});

test('focusOut sends value', function(assert)
{
	this.set('text', 'some data');

	this.set('externalAction', (actual) =>
	{
		let expected = this.get('value');
		assert.deepEqual(actual, expected, 'data is passed to external action');
	});

	this.render(hbs`
		{{bc-input onBlur=externalAction value=text}}
	`);

	this.$('input').trigger("focusout");
});

test('keyUp sends value', function(assert)
{
	let e = $.Event("keyup");
	e.which = 13;

	this.set('text', 'some text');

	this.set('externalAction', (actual) =>
	{
		let expected = this.get('value');
		assert.deepEqual(actual, expected, 'data is passed to external action');
	});

	this.render(hbs`
		{{bc-input onSubmit=externalAction value=text}}
	`);

	this.$('input').trigger(e);
});