/**
 * @module component
 *
 */
import Ember from 'ember';
import layout from '../templates/components/torpid-list';

/**
 * `Torpid/List`
 *
 * @class
 * Renders a list view of model objects
 *
 * torpid-list has two event callbacks `onClick` and `onSelect`.
 * The onSelect method must be used with `selector=true` refer to example two
 *
 * @example
 * // example 1
 * {{#torpid-list content=controller.content as |item|}}
 *	<!-- image container - left most container for images -->
 *	<div class="torpid-list-thumbnail"><img src={{item.imageName}} /></div>
 *
 *	<!-- info container - left aligned container -->
 *	<div class="torpid-list-info><h1>{{item.fullName}}</h1></div>
 *
 *	<!-- image container - right aligned container -->
 *	<div class="torpid-list-status></div>
 * {{/torpid-list}}
 *
 * //example 2
 * {{#torpid-list selector=true edit=controller.edit onSelect="mySelectMethod" content=controller.content as |item|}}
 *	<div class="torpid-list-thumbnail"><img src={{item.imageName}} /></div>
 *	<div class="torpid-list-info><h1>{{item.fullName}}</h1></div>
 * {{/torpid-list}}
 *
 * @extends Ember.Component
 */
export default Ember.Component.extend(
	/** @lends Torpid.List.prototype */
{
	layout: layout,

	tagName: 'section',

	classNames: ['torpid-list'],
	classNameBindings: ['selector', 'large', 'edit', 'hasImage:image', 'clickable'],

	/**
	 * Bool for setting the type of list
	 * true if the list is selectable
	 *
	 * @public
	 * @property selector
	 * @type boolean
	 */
	selector: false,

	/**
	 *
	 * @public
	 * @property hasImage
	 * @type boolean
	 */
	hasImage: false,

	/**
	 * Bool for toggling select mode
	 * set to true to show the select boxes
	 *
	 * @public
	 * @property edit
	 * @type boolean
	 */
	edit: false,

	large: false,

	clickable: Ember.computed('onClick', function()
	{
		return !Ember.isNone(this.get('onClick')) && !Ember.isEmpty(this.get('onClick')) ? true : false;
	}),

	/**
	 * The content array to render in the list
	 *
	 * @public
	 * @property content
	 * @type array
	 */
	content: null,

	model: null,

	setModel: function()
	{
		if(Ember.isNone(this.get('model')) && !Ember.isNone(this.get('content')))
		{
			Ember.deprecate('torpid-list: content is deprecated please use model');

			this.set('model', this.get('content'));
		}
	}.observes('content').on('init'),

	isSelectAll: false,

	modelChange: function()
	{
		this.set('selectedRows', []);
		this.set('isSelectAll', false);
	}.observes('model.@each.id'),

	hasModel: Ember.computed('model', function()
	{
		if (this.get('model.length') > 0)
		{
			return true;
		}
	}),

	/**
	 * Storage array for all selected rows that get passed to onSelect event callback
	 *
	 * @private
	 * @property selectedRows
	 * @type array
	 */
	selectedRows: null,

	actions: {
		/**
		 * Row clicked action handler
		 *
		 * @private
		 * @method rowClick
		 * @param model {object}
		 */
		rowClick: function(model)
		{
			this.sendAction('onClick', model);
		},

		itemSelected: function(isChecked, row)
		{
			if(Ember.isNone(this.get('selectedRows')))
			{
				this.set('selectedRows', []);
			}

			if(isChecked)
			{
				this.get('selectedRows').pushObject(row);
			}
			else
			{
				this.get('selectedRows').removeObject(row);
			}

			if(this.get('selectedRows.length') === this.get('model.length'))
			{
				this.set('isSelectAll', true);
			}
			else if(this.get('selectedRows.length') === 0)
			{
				this.set('isSelectAll', false);
			}

			this.sendAction('onSelect', isChecked, row);
		},

		selectAll: function(isChecked)
		{
			var model = this.get('model');
			var selectedRows = [];

			if(isChecked)
			{
				this.set('isSelectAll', true);
			}
			else
			{
				this.set('isSelectAll', false);
			}

			model.forEach(function(row)
			{
				if(isChecked)
				{
					row.set('isSelected', true);
				}
				else
				{
					row.set('isSelected', false);
				}

				if(row.get('isSelected'))
				{
					selectedRows.pushObject(row);
				}
				else
				{
					selectedRows.removeObject(row);
				}
			});

			this.set('selectedRows', selectedRows);

			this.sendAction('selectAll', isChecked, selectedRows.copy());
		},
	}
});
