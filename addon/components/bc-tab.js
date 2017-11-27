/**
 * @module Components
 *
 */
import { on } from '@ember/object/evented';
import $ from 'jquery';
import { next } from '@ember/runloop';
import { isNone } from '@ember/utils';
import Component from '@ember/component';
import layout from '../templates/components/bc-tab';

export default Component.extend({
	layout: layout,
	classNames: ['bc-tab'],
	classNameBindings: ['active:active', 'open:open'],

	active: false,
	open: false,
	tabName: null,
	tabIndex: 0,
	showBadge: false,
	badgeContent: null,
	badgeColor: null,

	/**
	 * @public
	 * @method registerTab
	 */
	registerTab() {
		if (!isNone(this.get('tabName')) && !isNone(this.get('parentView'))) {
			this.get('parentView').addTab(this);
		} else {
			next(this, function() {
				this.registerTab();
			});
		}
	},

	unregisterTab() {
		if (!isNone(this.get('tabName')) && !isNone(this.get('parentView'))) {
			this.get('parentView').removeTab(this);
		}
	},

	/**
	 * @public
	 * @method triggerShowTab
	 */
	triggerShowTab() {
		if (!this.get('isDestroyed')) {
			this.showTab();
		} else {
			next(this, function() {
				this.triggerShowTab();
			});
		}
	},

	/**
	 * @public
	 * @method showTab
	 */
	showTab() {
		if (!isNone(this.get('onShowTab'))) {
			const onShowTab = this.get('onShowTab');
			const children = this.get('childViews');
			$.each(children, function(k, v) {
				const actions = v.get('actions');
				if (children.hasOwnProperty(k) && actions[onShowTab]) {
					v.send(onShowTab);
				}
			});
		}
	},

	didRender: on('willInsertElement', function() {
		this.registerTab();
	}),

	didDestroy: on('willDestroyElement', function() {
		this.unregisterTab();
	}),

	actions: {
		openAccordian() {
			const isOpen = !this.get('open');
			this.set('open', isOpen);
			if (isOpen) {
				this.showTab();
			}
		}
	}
});
