/**
 * @module Mixins
 *
 */
import $ from 'jquery';
import Mixin from '@ember/object/mixin';
import EmberObject, { get, computed } from '@ember/object';
import { isNone } from '@ember/utils';
import { assert } from '@ember/debug';

const __propagation = [];

const EventClass = EmberObject.extend({
	id: null,
	target: null,

	__debugName: computed('target.{elementId,classNames}', function() {
		const elementId = get(this, 'target.elementId');
		const view = get(this, 'target.classNames')[0] || '';
		return `${elementId}_${view}`.replace(/_$/, '');
	})
});

function dispatchEvent(evt, index) {
	if (isNone(index)) {
		index = get(__propagation, 'length') - 1;
	}

	if (index < 0 || evt.isPropagationStopped()) {
		return false;
	}

	let eventClass = __propagation[index];

	// call event handler onEscape
	let res = get(eventClass, 'target').onEscape(evt);
	if (res === false) {
		return false;
	}

	return dispatchEvent(index-1);
}

$(document).on(`keyup.close-on-escape`, function(evt) {
	if (evt.keyCode === 27 && !evt.isPropagationStopped()) {
		let res = dispatchEvent.call(this, evt);
		if (res === false || evt.isPropagationStopped()) {
			if (!evt.isPropagationStopped()) {
				evt.stopPropagation();
			}
			return false;
		}
		return true;
	}
});

export default Mixin.create({
	addEventListener() {
		let id = this.get('elementId');

		let eventClass = __propagation.findBy('id', id);
		assert("event has been added already, you must remove the event first", isNone(eventClass));

		eventClass = EventClass.create({ id, target: this });
		__propagation.push(eventClass);
	},

	removeEventListener() {
		let id = this.get('elementId');
		let eventClass = __propagation.findBy('id', id);
		if (!isNone(eventClass)) {
			let index = __propagation.indexOf(eventClass);
			__propagation.splice(index, 1);
		}
	},

	onEscape() {
		return true;
	},

	willDestroyElement() {
		this._super();
		this.removeEventListener();
	}
});
