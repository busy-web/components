/**
 * @module Utils
 *
 */
import EmberObject, { computed, get, set } from '@ember/object';
import { dasherize, camelize, classify } from '@ember/string';
import { assert } from '@ember/debug';
import { isNone, isEmpty } from '@ember/utils';

/***/
const SORT_STATE = ['not-sorted', 'asc', 'desc'];

/**
 * Sort object manages the sort state for sortable lists
 *
 * @class SortableObject
 * @extends EmberObject
 */
const SortableObject = EmberObject.extend({

	/**
	 * properties
	 */
	id: '',
	modelAttr: '',
	sortState: 0,
	header: '',
	sortable: true,

	/**
	 * String generated for showing a table header
	 *
	 * @public
	 * @property headerName
	 * @type {string}
	 */
	headerName: computed('header', 'modelAttr', function() {
		if (!isEmpty(get(this, 'header'))) {
			return get(this, 'header');
		}
		return dasherize(get(this, 'modelAttr')).split('-').map(k => classify(k)).join(' ');
	}),

	/**
	 * boolean state property to see if the sortState is active
	 * meaning the state is 1 (asc) or 2 (desc) and not 0 (not sorted)
	 *
	 * @public
	 * @property isActive
	 * @type {boolean}
	 */
	isActive: computed('sortState', function() {
		return get(this, 'sortState') !== 0;
	}),

	/**
	 * Text representation of the sortState
	 *  0 => not-sorted
	 *  1 => asc
	 *	2 => desc
	 *
	 * @public
	 * @property sortDir
	 * @type {string}
	 */
	sortDir: computed('sortState', function() {
		return SORT_STATE[get(this, 'sortState')];
	}),

	asc: computed('sortState', function() {
		return get(this, 'sortState') === 1;
	}),

	desc: computed('sortState', function() {
		return get(this, 'sortState') === 2;
	}),

	/**
	 * toggle state between asc and desc.
	 * if state is 0 then toggle will move to 1
	 * if state is 1 then toggle will move to 2
	 * if state is 2 then toggle will move to 1
	 *
	 * @public
	 * @method toggleState
	 * @return {void}
	 */
	toggleState() {
		if (get(this, 'sortable')) {
			set(this, 'sortState', get(this, 'sortState') === 1 ? 2 : 1);
		}
	},

	/**
	 * sets the state back to 0 no matter what the current state is
	 *
	 * @public
	 * @method resetState
	 * @return {void}
	 */
	resetState() {
		set(this, 'sortState', 0);
	},

	/**
	 * getter for getting the sortBy and sortDir as an object { sortBy, sortDir }
	 *
	 * @public
	 * @method getSort
	 * @return {object}
	 */
	getState() {
		return {
			sortBy: get(this, 'modelAttr'),
			sortDir: SORT_STATE[get(this, 'sortState')]
		};
	}
});

export default function sortableObject(meta) {
	// get header if it was provided
	let header = get(meta, 'header');
	if (isNone(header)) {
		header = '';
	}

	// get modelAttr or create it from machineName or header
	let modelAttr = get(meta, 'modelAttr');
	if (isEmpty(modelAttr)) {
		let machineName = get(meta, 'machineName');
		if (!isEmpty(machineName)) {
			modelAttr = machineName;
		} else if (!isEmpty(header)) {
			modelAttr = camelize(header);
		}
	}

	assert("SortableObject requires a modelAttr, but modelAttr could not be found of inferred", !isEmpty(modelAttr));

	// get id or create it from modelAttr
	let id = get(meta, 'id');
	if (isEmpty(id)) {
		id = dasherize(modelAttr);
	}

	// get sort state or set default sortState to 0
	let sortState = get(meta, 'sortState');
	if (isEmpty(sortState)) {
		sortState = 0;
	} else if (typeof sortState === 'string' && SORT_STATE.indexOf(sortState) !== -1) {
		sortState = SORT_STATE.indexOf(sortState);
	} else if (typeof sortState === 'number' && SORT_STATE[sortState] === undefined) {
		sortState = 0;
	} else {
		sortState = 0;
	}

	let sortable = get(meta, 'sortable');
	if (sortable !== false) {
		sortable = true;
	}

	return SortableObject.create({id, modelAttr, sortState, header, sortable});
}
