import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bc-list', 'Integration | Component | bc list', {
  integration: true
});

test('it renders with no entries', function(assert)
{
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  // Template block usage:
  this.render(hbs`
	{{#bc-list}}
	  template block text
	{{/bc-list}}
  `);

  assert.equal(this.$().text().trim(), 'No Entries Found');
});


test('it renders with header and entries', function(assert)
{
	this.set('headerArray', [
		'section1',
		'section2',
		'section3'
	]);

	this.set('model', [
		{name: 'Bob Thomas', occupation: 'bullfighter', age: 32},
		{name: 'John Smith', occupation: 'astronaut', age: 39}
	]);

	this.render(hbs`
		{{#bc-list headerItems=headerArray model=model as |item|}}
		<span>{{item.name}}</span>
		<span>{{item.age}}</span>
		{{/bc-list}}
	`);

	assert.equal(this.$().text().replace(/\s+/g, ''), 'section1section2section3BobThomas32JohnSmith39');
});

test('onClick action runs', function(assert)
{
	this.set('externalAction', (actual) =>
	{
		let expected = {name: 'Bob Thomas', occupation: 'bullfighter', age: 32};
		assert.deepEqual(actual, expected, 'row data is passed to external action');
	});

	this.set('model', [
		{name: 'Bob Thomas', occupation: 'bullfighter', age: 32},
	]);

	this.render(hbs`
		{{#bc-list headerItems=headerArray onClick=(action externalAction) model=model as |item|}}
		<span>{{item.name}}</span>
		<span>{{item.age}}</span>
		{{/bc-list}}
	`);

	this.$('.bc-list-row').click();

});