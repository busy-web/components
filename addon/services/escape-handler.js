/**
 * @module Service
 *
 */
import Service from '@ember/service';
import EmberObject, { get, computed } from '@ember/object';
import { A } from '@ember/array';
import { isNone } from '@ember/utils';
import { assert } from '@ember/debug';
import { bind } from '../utils/event';

/***/
const __propagation = A();

export default Service.extend({

	init() {
		this._super();

		bind(document, `keyup`, `service-escape-handler`, function(evt) {
			if (evt.keyCode === 27) {
				let res = dispatchEvent.call(this, evt);
				if (res === false) {
					evt.stopPropagation();
					return false;
				}
				return true;
			}
		}, { capture: true, rebind: true });
	},

	addListener(target, id) {
		let eventClass = __propagation.findBy('id', id);
		assert("event has been added already, you must remove the event first", isNone(eventClass));

		eventClass = EventClass.create({ id, target });
		__propagation.push(eventClass);
	},

	removeListener(id) {
		let eventClass = __propagation.findBy('id', id);
		if (!isNone(eventClass)) {
			let index = __propagation.indexOf(eventClass);
			__propagation.splice(index, 1);
		}
	}
});


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

	if (index < 0) { // || evt.isPropagationStopped()) {
		return false;
	}

	let eventClass = __propagation[index];

	// call event handler onEscape
	let res = get(eventClass, 'target').onEscape(evt);
	if (res === false) {
		return false;
	}

	return dispatchEvent(evt, index-1);
}

