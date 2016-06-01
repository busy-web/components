
import Ember from 'ember';

export default Ember.Route.extend(
{
	model: function()
	{
		return Ember.RSVP.hash(
		{
			people: Ember.A([
				Ember.Object.create({name: 'Bob Thomas'}),
				Ember.Object.create({name: 'John Smith'}),
				Ember.Object.create({name: 'Bill Billstien'}),
				Ember.Object.create({name: 'Jerry Gary'}),
			]),

			select: Ember.A([
				Ember.Object.create({label: "test 1", key: 0}),
				Ember.Object.create({label: "test 2", key: 1}),
				Ember.Object.create({label: "test 3", key: 0}),
			])
		});
	}
});
