import Ember from 'ember';
import layout from '../templates/components/bc-tab';

export default Ember.Component.extend(
{
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

	init() {
		this._super();
		this.registerTab();
	},

	/**
	 * @public
	 * @method registerTab
	 */
	registerTab() {
		if (!Ember.isNone(this.get('tabName')) && !Ember.isNone(this.get('parentView'))) {
			this.get('parentView').addTab(this);
		} else {
			Ember.run.next(this, function() {
				this.registerTab();
			});
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
			Ember.run.next(this, function() {
				this.triggerShowTab();
			});
		}
	},

	/**
	 * @public
	 * @method showTab
	 */
	showTab() {
		if (!Ember.isNone(this.get('onShowTab'))) {
			var onShowTab = this.get('onShowTab');
			var children = this.get('childViews');
			Ember.$.each(children, function(k, v) {
				var actions = v.get('actions');
				if (children.hasOwnProperty(k) && actions[onShowTab]) {
					v.send(onShowTab);
				}
			});
		}
	},

	actions: {
		openAccordian() {
			var isOpen = !this.get('open');
			this.set('open', isOpen);
			if (isOpen) {
				this.showTab();
			}
		}
	}
});
