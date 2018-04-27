/**
 * @module component
 *
 */
import { getOwner } from '@ember/application';
import EmberObject, { computed, get, set } from '@ember/object';
import { assert } from '@ember/debug';
import { isNone, isEmpty } from '@ember/utils';
import Component from '@ember/component';
import sortableObject from '../utils/sortable-object';
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
	meta: null,
	defaultSort: false,
	childModelPath: 'children',

	__meta: null,
	__data: null,

	init() {
		this._super();

		// setup meta data
		setupMeta(this);

		// setup report data
		setupReportData(this);
	},

	/**
	 * Handles sorting the data according to the new SortableObject state
	 *
	 * @public
	 * @method sort
	 * @param data {ModelContainer[]} ModelContainer array to sort
	 * @param sortable {SortableObject} SortableObject state to sort by
	 * @return {ModelContainer[]}
	 */
	sort(data, sortable) {
		if (!isNone(sortable) && sortable.get('isActive')) {
			const { sortBy, sortDir } = sortable.getState();
			data = sort(data, sortBy, sortDir);
		}
		return data;
	},

	/**
	 * toggles the new sort state and resets all the other sort states
	 *
	 * @public
	 * @method handleMetaSort
	 * @param currentSortable {SortableObject} the new sort object to toggle
	 * @return {void}
	 */
	handleMetaSort(currentSortable) {
		// change sort dir for meta sort item
		currentSortable.toggleState();

		// reset other sortable objects
		get(this, '__meta').forEach(sortable => {
			if (get(sortable, 'id') !== get(currentSortable, 'id')) {
				sortable.resetState();
			}
		});
	},

	actions: {
		sortAction(sortable) {
			// reset other sort states
			this.handleMetaSort(sortable);

			// save new sorted data
			set(this, '__data', this.sort(get(this, '__data').slice(0), sortable));

			// send onSort action
			this.sendAction('onSort', sortable.getState());
		},

		rowClickAction(item) {
			this.sendAction('rowAction', item);
		}
	}
});

function sort(data, sortBy, sortDir) {
	assert('sort requires an array of objects as the first param', !isEmpty(data) && Array.isArray(data));
	assert('sort requires a sortBy string as the second param', !isEmpty(sortBy) && typeof sortBy === 'string');
	assert('sort requires a sortDir string [asc, desc] as the third param', !isEmpty(sortDir) && (sortDir === 'asc' || sortDir === 'desc'));

	// sort data
	return sortData(data, sortBy, sortDir);
}

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
function sortData(data, sortBy, dir='asc') {
	assert("dir must be either `asc` or `desc`", dir === 'asc' || dir === 'desc');

	//const sortBy = `${prop}.value`;
	const gt = dir === 'asc' ? -1 : 1;
	const lt = dir === 'asc' ? 1 : -1;

	return data.sort((a, b) => {
		let aVal = normalize(a.get(sortBy));
		let bVal = normalize(b.get(sortBy));

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

/**
 * ModelContainer class for display multiple ModelProperty classes in
 * a row of data
 *
 * @class ModelContainer
 */
const ModelContainer = EmberObject.extend({
	model: null,
	modelProps: null,
	children: null,

	/**
	 * getter method
	 * this will return key => modelProps.find(key).value
	 * if the property does not exist on this object
	 *
	 * @public
	 * @method get
	 * @param key {string}
	 * @return {mixed}
	 */
	get(key) {
		let idx = key.indexOf('.');
		let kFirst = key;
		let kRest = '';
		if (idx !== -1) {
			kFirst = key.slice(0, idx);
			kRest = key.slice(idx+1);
		}

		let result = get(this, kFirst);
		if (isNone(result)) {
			result = get(this, 'modelProps').findBy('attrName', kFirst);
			if (isEmpty(kRest)) {
				result = get(result, 'value');
			}
		}

		if (!isEmpty(kRest)) {
			result = get(result, kRest);
		}
		return result;
	}
});

/**
 * ModelProperty class helper for
 * showing and sorting the property for a specific header meta
 *
 * @class ModelProperty
 */
const ModelProperty = EmberObject.extend({
	container: null,

	id: null,
	attrName: null,
	isImage: false,
	formatCurrency: false,
	formatTime: false,

	/**
	 * @public
	 * @property value
	 * @type {string}
	 */
	value: computed('attrName', function() {
		const attr = this.get('attrName');
		assert('attrName was not found on ModelProperty class', !isEmpty(attr) && typeof attr === 'string');
		return this.get(`container.model.${attr}`);
	}),

	/**
	 * js method to convert an object to a string.
	 * in this case it will return the value of this.value
	 *
	 * this is useful for when something tries to use this as a string
	 * it will have a valid output
	 *
	 * @public
	 * @method toString
	 */
	toString() {
		return this.get('value') || '';
	}
});

/**
 * pares the model data and create ModelContainers with ModelProperty
 * classes
 *
 * @private
 * @method createModelContainer
 * @param target {class} calling class `this` instance
 * @param model {object[]} array of model objects
 * @param metaData {object[]} array of model meta objects
 * @return {object[]}
 */
function createModelContainer(target, model, metaData) {
	assert('model is required for createModelContainer', !isNone(model) && typeof model === 'object');
	assert('metaData is required for createModelContainer', !isEmpty(metaData) && Array.isArray(metaData));

	// create container
	const owner = getOwner(model);
	const container = ModelContainer.create(owner.ownerInjection(), { model });

	// create modelProps
	const modelProps = metaData.map(meta => {
		const id = get(meta, 'id');
		const attrName = get(meta, 'modelAttr');
		const opts = { container, id, attrName };
		if (get(meta, 'isImage')) { opts.isImage = true; }
		if (get(meta, 'formatCurrency')) { opts.formatCurrency = true; }
		if (get(meta, 'formatTime')) { opts.formatTime = true; }

		return ModelProperty.create(opts);
	});

	// set modelProps on container
	set(container, 'modelProps', modelProps);

	// create child containers
	if (!isEmpty(get(model, get(target, 'childModelPath')))) {
		set(container, 'children', get(model, get(target, 'childModelPath')).map(child => createModelContainer(child, metaData)));
	} else {
		set(container, 'children', []);
	}

	return container;
}

/**
 * setup report data and handle loading the initial sort state
 *
 * this should only be called from init
 *
 * @private
 * @method setupReportData
 * @param target {class} calling class `this` instance
 * @return {void}
 */
function setupReportData(target) {
	const meta = get(target, '__meta');
	let data = get(target, 'model').map(item => createModelContainer(target, item, meta));

	// get sort state if it was set on init
	let sortable = get(target, '__meta').find(i => i.get('isActive'));

	// option default first property sort
	if (get(target, 'defaultSort') && isNone(sortable)) {
		sortable = get(target, '__meta.firstObject');
		sortable.toggleState();
	}

	// try calling sort then save the data
	set(target, '__data', target.sort(data, sortable));
}

/**
 * initial call to setup the meta data
 * for the models.
 *
 * this will look for a meta object on the target class first
 * then move on to a meta object on the model for the target class
 *
 * in the future this should try to gennerate the meta from the model itself
 * if no meta is provided.
 *
 * @private
 * @method setupMeta
 * @param target {class} calling classs `this` instance
 * @return {void}
 */
function setupMeta(target) {
	let meta = get(target, 'meta');
	if (isNone(meta)) {
		meta = get(target, 'model.meta');
		// TODO:
		// add mode meta generator
		/*if (isNone(meta)) {
			meta = generateMeta(target);
		}*/
	}

	assert('meta could not be found for bc-sortable-list', !isEmpty(meta) && Array.isArray(meta));

	// create copy of meta
	meta = meta.slice(0);

	// map meta to create sortable objects
	let newMeta = meta.map(item => sortableObject(item));

	// save the new meta array
	set(target, '__meta', newMeta);
}

//function generateMeta(target) {
//	let model = get(target, 'model.firstObject');
//	let meta = [];
//
//	let keys = Object.keys(model);
//	console.log('model keys', keys);
//}

