/**
 * @module component
 *
 */
import { camelize } from '@ember/string';
import EmberObject from '@ember/object';
import { A } from '@ember/array';
import { assert } from '@ember/debug';
import { isNone } from '@ember/utils';
import Component from '@ember/component';
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
export default Component.extend({
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
		if (isNone(meta)) {
			if (isNone(model.get('meta'))) {
				assert('meta data not present');
			} else {
				this.set('meta', model.get('meta'));
			}
		}
	},

	setReportData() {
		let model = this.get('model');
		const meta = this.get('meta');
		let reportData = A([]);


		model.forEach(item => {
			let newModel = EmberObject.create({});
			meta.forEach(metaItem => {
				const header = metaItem.machineName || camelize(metaItem.header);

				if (!isNone(item.get(header))) {
					if (metaItem.isImage) {
						newModel.set(header, {imageUrl: item.get(header), 'isImage': true});
					} else {
						newModel.set(header, item.get(header));
					}

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
			const sortBy = item.machineName || camelize(item.header);

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
			} else if (item.get('desc')) {
				item.set('notSorted', false);
				item.set('desc', false);
				item.set('asc', true);
				this.set('reportData', this.get('reportData').sortBy(sortBy).reverse());
			}
		}
	}
});
