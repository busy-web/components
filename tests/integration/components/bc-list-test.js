import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bc-list', 'Integration | Component | bc list', {
  integration: true
});

const stubModel = [
		{name: 'Bob Thomas', occupation: 'bullfighter', age: 32},
	];

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

test('deprecation gets called', function(assert)
{
	this.set('model', stubModel);

	this.render(hbs`
		{{#bc-list content=model as |item|}}
		<span>{{item.name}}</span>
		<span>{{item.age}}</span>
		{{/bc-list}}
	`);
	assert.throws('bc-list: content is deprecated please use model');
});

test('onClick action runs', function(assert)
{
	this.set('externalAction', (actual) =>
	{
		let expected = stubModel[0];
		assert.deepEqual(actual, expected, 'row data is passed to external action');
	});

	this.set('model', stubModel);

	this.render(hbs`
		{{#bc-list headerItems=headerArray onClick=(action externalAction) model=model as |item|}}
		<span>{{item.name}}</span>
		<span>{{item.age}}</span>
		{{/bc-list}}
	`);

	this.$('.bc-list-row').click();

});

test('select all works', function(assert)
{
	this.set('model', stubModel);
	this.render(hbs`
		{{#bc-list headerItems=headerArray selector=true model=model as |item|}}
		<span>{{item.name}}</span>
		<span>{{item.age}}</span>
		{{/bc-list}}
	`);

	this.$('.select').click();
	assert.equal(this.$('p.selected-rows').text(), '');

});