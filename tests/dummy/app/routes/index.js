
import EmberObject from '@ember/object';
import { A } from '@ember/array';
import { hash } from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		return hash({
			people: A([
				EmberObject.create({name: 'Bob Thomas', occupation: 'bullfighter', age: 32}),
				EmberObject.create({name: 'John Smith', occupation: 'astronaut', age: 39}),
				EmberObject.create({name: 'Bill Billstien', occupation: 'cowboy', age: 47}),
				EmberObject.create({name: 'Jerry Gary', occupation: 'ember developer', age: 28}),
			]),

			select: A([
				EmberObject.create({label: "test 1", key: 0}),
				EmberObject.create({label: "test 2", key: 1}),
				EmberObject.create({label: "test 3", key: 0}),
			]),

			meta: A([
				EmberObject.create({header: "Name", sortable: true}),
				EmberObject.create({header: "Occupation", sortable: true}),
				EmberObject.create({header: "Age", sortable: false})
			])
		});
	}
});
