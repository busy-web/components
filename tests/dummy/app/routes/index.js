
import Ember from 'ember';

export default Ember.Route.extend(
{
	model: function()
	{
		return Ember.RSVP.hash(
		{
			people: Ember.A([
				Ember.Object.create({name: 'Bob Thomas', occupation: 'bullfighter', age: 32}),
				Ember.Object.create({name: 'John Smith', occupation: 'astronaut', age: 39}),
				Ember.Object.create({name: 'Bill Billstien', occupation: 'cowboy', age: 47}),
				Ember.Object.create({name: 'Jerry Gary', occupation: 'ember developer', age: 28}),
			]),

			select: Ember.A([
				Ember.Object.create({label: "test 1", key: 0}),
				Ember.Object.create({label: "test 2", key: 1}),
				Ember.Object.create({label: "test 3", key: 0}),
			]),

			meta: Ember.A([
				Ember.Object.create({header: "Name", sortable: true}),
				Ember.Object.create({header: "Occupation", sortable: true}),
				Ember.Object.create({header: "Age", sortable: false})
			])
		});
	}
});
