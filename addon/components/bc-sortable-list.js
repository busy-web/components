/**
 * @module component
 *
 */
import Ember from 'ember';
import layout from '../templates/components/bc-sortable-list';

/**
 * `BC/SortableList`
 *
 * @class
 * Renders a sortable list view of model objects
 *
 *
 * @extends Ember.Component
 */
export default Ember.Component.extend(
{
	layout: layout,
	classNames: ['bc-sortable-list'],
	model: null,
	meta: null,

	init() {
		this._super();
		this.setMeta();
		this.addSortClasses();
	},

	setMeta() {
		let meta = this.get('meta');
		const model = this.get('model');
		if (Ember.isNone(meta)) {
			if (Ember.isNone(model.get('meta'))) {
				Ember.assert('meta data not present');
			} else {
				this.set('meta', model.get('meta'));
			}
		}
	},

	addSortClasses() {
		const headers = this.get('meta');
		headers.forEach(item => {
			item.set('sortClass', 'not-sorted');
		});
	},

	actions: {
		sortAction(item) {

			const sortBy = Ember.String.camelize(item.header);

			this.get('meta').forEach(header => {
				if (header !== item) {
					header.set('sortClass', 'not-sorted');
				}
			});

			if (item.get('sortClass') === 'not-sorted' || item.get('sortClass') === 'asc') {
				item.set('sortClass', 'desc');
				this.set('model', this.get('model').sortBy(sortBy));
			} else if (item.get('sortClass') === 'desc') {
				item.set('sortClass', 'asc');
				this.set('model', this.get('model').sortBy(sortBy).reverse());
			}

		},
	}
});
