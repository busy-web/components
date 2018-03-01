/**
 * @module Utils
 *
 */
import { assert } from '@ember/debug';
import { isNone, isEmpty } from '@ember/utils';

/**
 * List of all current event names and there listener
 *
 * @private
 * @property __eventListeners
 * @type {Map}
 */
let __eventListeners = window.__busywebEventListeners;
if (isNone(__eventListeners)) {
	__eventListeners = new window.Map();
	window.__busywebEventListeners = __eventListeners;
}

/**
 * generates the event name from the event type and namespace
 *
 * @private
 * @method eventName
 * @param type {string} case-sensitive string for the event type
 * @param namespace {string} case-sensitive string to distinguish this event from other events
 * @return {string} event name
 */
function eventName(type, namespace) {
	assert('type {string} is a required param to bind', !isEmpty(type) && typeof type === 'string');
	assert('namespace {string} is a required param to bind', !isEmpty(namespace) && typeof namespace === 'string');

	return `${type}.${namespace}`;
}

/**
 * gets a listener from the __eventListeners list
 *
 * @private
 * @method getListener
 * @param type {string} case-sensitive string for the event type
 * @param namespace {string} case-sensitive string to distinguish this event from other events
 * @return {function} the event listener
 */
function getListener(type, namespace) {
	return __eventListeners.get(eventName(type, namespace));
}

/**
 * adds a listener to the __eventListeners list
 *
 * @private
 * @method setListener
 * @param type {string} case-sensitive string for the event type
 * @param namespace {string} case-sensitive string to distinguish this event from other events
 * @param listener {function} the callback method for events
 * @return {void}
 */
function setListener(type, namespace, listener, capture=false, passive=false) {
	assert('listener {function} is a required param to bind', !isEmpty(listener) && typeof listener === 'function');
	assert('capture {boolean} must be a boolean value true | false', typeof capture === 'boolean');
	assert('passive {boolean} must be a boolean value true | false', typeof passive === 'boolean');

	__eventListeners.set(eventName(type, namespace), { listener, capture, passive });
}

/**
 * removes a listener from the __eventListeners list
 *
 * @private
 * @method removeListener
 * @param type {string} case-sensitive string for the event type
 * @param namespace {string} case-sensitive string to distinguish this event from other events
 * @return {void}
 */
function removeListener(type, namespace) {
	__eventListeners.delete(eventName(type, namespace));
}

function hasListener(type, namespace) {
	return __eventListeners.has(eventName(type, namespace));
}

/**
 * Bind an event listener to the target element
 */
export function bind(target, type, namespace, listener, { capture=false, rebind=false, passive=false, once=false }) {
	assert('target {DOM Element} is a required param to bind', !isNone(target) && target.addEventListener !== undefined);

	// optional params must be boolean values
	assert('capture {boolean} must be a boolean value true | false', typeof capture === 'boolean');
	assert('rebind {boolean} must be a boolean value true | false', typeof rebind === 'boolean');
	assert('passive {boolean} must be a boolean value true | false', typeof passive === 'boolean');
	assert('once {boolean} must be a boolean value true | false', typeof once === 'boolean');

	// auto rebind the event if rebind is set to true.
		assert("An event already exists for this event. You must unbind it first, or pass rebind true to the bind method to auto rebind the event", rebind === true);

	if (hasListener(type, namespace)) {
		// unbind the event and remove the local listener so it can be bound again.
		unbind(target, type, namespace);
	}

	// save the event listener method for ubinding later
	setListener(type, namespace, listener, capture, passive);

	// add the target event listener
	target.addEventListener(type, listener, { capture, once, passive });
}

export function unbind(target, type, namespace) {
	assert('target {DOM Element} is a required param to bind', !isNone(target) && target.removeEventListener !== undefined);

	// remove event if the event has been added
	if (hasListener(type, namespace)) {
		// get event listener for this namespace
		let eventData = getListener(type, namespace);

		// remove event listener for local namespace
		removeListener(type, namespace);

		// remove targets event listener
		target.removeEventListener(type, eventData.listener, { capture: eventData.capture, passive: eventData.passive });
	}
}


