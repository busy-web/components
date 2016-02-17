import Ember from 'ember';
import layout from '../templates/components/torpid-tab';

export default Ember.Component.extend(
{
	layout: layout,

	classNames: ['torpid-tab'],
	classNameBindings: ['active', 'open'],

	active: false,
	open: false,

	tabName: null,
	tabIndex: 0,

	init: function()
	{
		this._super();

		this.registerTab();
	},

	/**
	 * @public
	 * @method registerTab
	 */
	registerTab: function()
	{
		if(!Ember.isNone(this.get('tabName')) && !Ember.isNone(this.get('parentView')))
		{
			this.get('parentView').addTab(this);
		}
		else
		{
			Ember.run.next(this, function()
			{
				this.registerTab();
			});
		}
	},

	/**
	 * @public
	 * @method triggerShowTab
	 */
	triggerShowTab: function()
	{
		if(this.get('_state') === 'inDOM')
		{
			this.showTab();
		}
		else
		{
			Ember.run.next(this, function()
			{
				this.triggerShowTab();
			});
		}
	},

	/**
	 * @public
	 * @method showTab
	 */
	showTab: function()
	{
		if(!Ember.isNone(this.get('onShowTab')))
		{
			var onShowTab = this.get('onShowTab');
			var children = this.get('childViews');
			Ember.$.each(children, function(k, v)
			{
				if(children.hasOwnProperty(k) && v._actions[onShowTab])
				{
					v.send(onShowTab);
				}
			});
		}
	},

	actions: {
		openAccordian: function()
		{
			var isOpen = !this.get('open');
			this.set('open', isOpen);

			if(isOpen)
			{
				this.showTab();
			}
		}
	}
});
