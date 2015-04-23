
import Ember from 'ember';

export default Ember.Route.extend(
{

	model: function()
	{
		return new Ember.RSVP.Promise(function(resolve)
		{
			Ember.run(null, resolve, Ember.A([
				Ember.Object.create({name: 'Bob Thomas'}),
				Ember.Object.create({name: 'John Smith'}),
				Ember.Object.create({name: 'Bill Billstien'}),
				Ember.Object.create({name: 'Jerry Gary'}),
			]));
		});
	}
});
