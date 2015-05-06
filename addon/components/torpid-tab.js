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

	init: function()
	{
		this._super();

		this.registerTab();
	},

	/**
	 *Ember Property function
	 *
	 * @public
	 * @method showView
	 * @returns {boolean} acitve or open, variables
	 */
//	showView: function()
//	{
//		return this.get('active') || this.get('open');
//	}.property('active', 'open'),

	/**
	 * @public
	 * @method registerTab
	 *  
	 */
	registerTab: function()
	{
		if(!Ember.isNone(this.get('tabName')))
		{
			var tabs = this.get('parentView.content');

			if(Ember.isEmpty(tabs))
			{
				this.set('active', true);
				this.set('open', true);
				tabs.pushObject(this);
				this.triggerShowTab();
			}
			else
			{
				tabs.pushObject(this);
			}
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
			this.set('open', !this.get('open'));
		}
	},

});
