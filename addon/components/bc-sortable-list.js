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
export default Ember.Component.extend({
	layout: layout,
	classNames: ['bc-sortable-list'],
	model: null,
	reportData: null,
	meta: null,

	init() {
		this._super();
		this.setMeta();
		this.addSortClasses();
		this.setReportData();
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

	setReportData() {
		let model = this.get('model');
		const meta = this.get('meta');
		let reportData = Ember.A([]);


		model.forEach(item => {
			let newModel = Ember.Object.create({});
			meta.forEach(metaItem => {
				const  header = metaItem.machineName || Ember.String.camelize(metaItem.header);
				const machineHeader = header.replace('-', '.');

				if (!Ember.isNone(item.get(machineHeader))) {

					let newObject = Ember.Object.create({data: item.get(machineHeader)});

					if (metaItem.isImage) {
						newObject.set('isImage', true);
					} if (metaItem.formatCurrency) {
						newObject.set('formatCurrency', true);
					} if (metaItem.formatTime) {
						newObject.set('formatTime', true);
					}

					newModel.set(header, newObject);

				} else {
					newModel.set(header, '-');
				}
			});

			reportData.push(newModel);

		});
		this.set('reportData', reportData);
	},

	addSortClasses() {
		const headers = this.get('meta');
		headers.forEach(item => {
			if (item.sortable) {
				item.set('notSorted', true);
				item.set('desc', false);
				item.set('asc', false);
			}
		});
	},

	actions: {
		sortAction(item) {

			const sortBy = item.machineName || Ember.String.camelize(item.header);

			this.get('meta').forEach(header => {

				if (header.get('header') !== item.get('header')) {
					header.set('notSorted', true);
					header.set('desc', false);
					header.set('asc', false);
				}
			});
			if (item.get('notSorted') || item.get('asc')) {
				item.set('notSorted', false);
				item.set('desc', true);
				item.set('asc', false);

				this.set('reportData', this.get('reportData').sortBy(sortBy));
				console.log(this.get('reportData').firstObject());
			} else if (item.get('desc')) {
				item.set('notSorted', false);
				item.set('desc', false);
				item.set('asc', true);
				this.set('reportData', this.get('reportData').sortBy(sortBy).reverse());
			}
		}
	}
});
