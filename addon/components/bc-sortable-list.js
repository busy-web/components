/**
 * @module component
 *
 */
import { camelize } from '@ember/string';
import EmberObject, { get, set } from '@ember/object';
import { assert } from '@ember/debug';
import { isNone, isEmpty } from '@ember/utils';
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
	withChildren: false,
	childrenArray: 'none',

	init() {
		this._super();
		this.setMeta();
		this.resetSortClasses();
		this.setReportData();
	},

	setMeta() {
		const meta = get(this, 'meta');
		const model = get(this, 'model');

		if (isNone(meta)) {
			assert('meta data not present', !isNone(get(model, 'meta')));

			set(this, 'meta', get(model, 'meta'));
		}
	},

	setReportData() {
		const model = get(this, 'model');
		const reportData = model.map(item => this.createSortableObject(item));

		const meta = get(this, 'meta');
		const first = Array.isArray(meta) && meta[0];
		this.sort(first, reportData);
	},

	createSortableObject(item, childArray) {
		const newModel = EmberObject.create({});
		const meta = get(this, 'meta');
		const childrenArray = childArray || get(this, 'childrenArray');

		meta.forEach(metaItem => {
			const  header = get(metaItem, 'machineName') || camelize(get(metaItem, 'header'));
			const machineHeader = header.replace('-', '.');

			if (!isNone(get(item, machineHeader))) {
				const newObject = EmberObject.create({
					content: get(item, machineHeader),
					isImage: get(metaItem, 'isImage') ? true : false,
					formatCurrency: get(metaItem, 'formatCurrency') ? true : false,
					formatTime: get(metaItem, 'formatTime') ? true : false
				});

				if (get(this, 'withChildren') && !isEmpty(get(item, childrenArray))) {
					set(item, 'children', get(item, childrenArray).map(child => this.createSortableObject(child)));
				}

				set(newModel, camelize(header), newObject);
			} else {
				set(newModel, camelize(header), '-');
			}
		});
		return newModel;
	},

	resetSortClasses() {
		const headers = get(this, 'meta');
		headers.forEach(item => {
			if (get(item, 'sortable')) {
				set(item, 'notSorted', true);
				set(item, 'desc', false);
				set(item, 'asc', false);
			}
		});
	},

	sort(item, reportData=null) {
		reportData = reportData || get(this, 'reportData');

		// set data to empty array incase report is empty and
		// setting it to empty will force ember to rerender the data
		// after data is sorted.
		set(this, 'reportData', []);

		// is there is no report data then skip the sort
		if (!isEmpty(reportData)) {
			// if there is no item data then skip the sort
			if (!isNone(item)) {
				// get sort direction
				let dir = 'asc';
				if (get(item, 'asc')) {
					dir = 'desc';
				}

				// reset all sort classes
				this.resetSortClasses();

				// unset not sorted
				set(item, 'notSorted', false);

				// set sort direction to true
				set(item, dir, true);

				// get sortBy name
				const sortBy = get(item, 'machineName') || camelize(get(item, 'header'));

				// sort data
				reportData = sortData(reportData, sortBy, dir);
			}

			// set reportData even if the data is not sorted
			// so data is not still the empty array set above
			set(this, 'reportData', reportData);
		}
	},

	actions: {
		sortAction(item) {
			// call sort method
			this.sort(item);
		},

		rowClickAction(item) {
			this.sendAction('rowAction', item);
		}
	}
});


/**
 * normalize the input for better sorting results
 *
 * @private
 * @method normalize
 * @param value {mixed}
 * @return {mixed}
 */
function normalize(value) {
	if (isNone(value)) {
		return '';
	}

	if (typeof value === 'string') {
		return value.trim().toLowerCase();
	} else {
		return value.toString();
	}
}

/**
 * sort method that will sort empty strings to the bottom
 * instead of the top of an 'asc' list
 *
 * @private
 * @method sortData
 * @param data {object[]} array of objects
 * @param prop {string} the key to the data in the object array
 * @param dir {string} sort direction `asc` or `desc`
 * @return {object[]}
 */
function sortData(data, prop, dir='asc') {
	assert("dir must be either `asc` or `desc`", dir === 'asc' || dir === 'desc');

	const sortBy = `${prop}.content`;
	const gt = dir === 'asc' ? -1 : 1;
	const lt = dir === 'asc' ? 1 : -1;

	return data.sort((a, b) => {
		let aVal = normalize(get(a, sortBy));
		let bVal = normalize(get(b, sortBy));

		if (isEmpty(aVal) && isEmpty(bVal)) {
			return 0;
		} else if (isEmpty(aVal)) {
			return lt;
		} else if (isEmpty(bVal)) {
			return gt;
		}

		return (aVal < bVal ? gt : (bVal < aVal ? lt : 0));
	});
}
