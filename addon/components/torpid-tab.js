import Ember from 'ember';
import layout from '../templates/components/torpid-tab';

export default Ember.Component.extend({
	layout: layout,

	classNames: ['torpid-tab'],
	classNameBindings: ['active', 'open'],
	active: false,
	open: false,
	highlight: false,
	
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
	showView: function()
	{
		return this.get('active') || this.get('open');
	}.property('active', 'open'),

	/**
	 * @public
	 * @method registerTab
	 *  
	 */
	registerTab: function()
	{
		if(!Ember.isNone(this.get('tabName')))
		{
			if(Ember.isEmpty(this.get('parentView.tabNames')))
			{
				this.set('active', true);
				this.get('parentView.tabNames').pushObject(this);
				this.triggerShowTab();
			}
			else
			{
				this.get('parentView.tabNames').pushObject(this);
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
			$.each(children, function(k, v)
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
			if(this.get('active'))
			{
				this.set('highlight', !this.get('highlight'));
				console.log("Check");
			}
		}
	},

});
