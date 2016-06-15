/**
 * @module component
 *
 */
import Ember from 'ember';
import layout from '../templates/components/bc-list';

/**
 * `BC/List`
 *
 * @class
 * Renders a list view of model objects
 *
 * bc-list has two event callbacks `onClick` and `onSelect`.
 * The onSelect method must be used with `selector=true` refer to example two
 *
 * @example
 * // example 1
 * {{#bc-list content=controller.content as |item|}}
 *	<!-- image container - left most container for images -->
 *	<div class="bc-list-thumbnail"><img src={{item.imageName}} /></div>
 *
 *	<!-- info container - left aligned container -->
 *	<div class="bc-list-info><h1>{{item.fullName}}</h1></div>
 *
 *	<!-- image container - right aligned container -->
 *	<div class="bc-list-status></div>
 * {{/bc-list}}
 *
 * //example 2
 * {{#bc-list selector=true edit=controller.edit onSelect="mySelectMethod" content=controller.content as |item|}}
 *	<div class="bc-list-thumbnail"><img src={{item.imageName}} /></div>
 *	<div class="bc-list-info><h1>{{item.fullName}}</h1></div>
 * {{/bc-list}}
 *
 * @extends Ember.Component
 */
export default Ember.Component.extend(
	/** @lends BC.List.prototype */
{
	layout: layout,

	// tagName: 'section',

	classNames: ['bc-list'],
	// classNameBindings: ['selector', 'large', 'edit', 'hasImage:image', 'clickable'],

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
	hasHeader: true,
	headerItems: null,
	minimal: false,

	clickable: Ember.computed('onClick', function()
	{
		return !Ember.isNone(this.get('onClick')) && !Ember.isEmpty(this.get('onClick')) ? true : false;
	}),

	isLoading: Ember.computed('model', 'model.isLoaded', 'model.[]', 'model.length', function()
	{
		console.log(this.get('model.isLoaded'), this.get('model.length'), this.get('model.get'));
		if(!Ember.isNone(this.get('model')))
		{
			if(this.get('model.get') && this.get('model.isLoaded'))
			{
				return false;
			}
			else if(this.get('model.length'))
			{
				return false;
			}
		}
		return true;
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

	init()
	{
		this._super();
		this.setModel();
	},

	setModel: Ember.observer('content', function()
	{
		if(Ember.isNone(this.get('model')) && !Ember.isNone(this.get('content')))
		{
			Ember.deprecate('bc-list: content is deprecated please use model');

			this.set('model', this.get('content'));
		}
	}),

	isSelectAll: false,

	modelChange: Ember.observer('model.@each.id', function()
	{
		this.set('selectedRows', []);
		this.set('isSelectAll', false);
	}),

	hasModel: Ember.computed('model', function()
	{
		if (this.get('model.length') > 0)
		{
			return true;
		}
	}),

	modelSetObserver: Ember.observer('model', 'model.[]', 'model.length', function()
	{
		this.renderTemplates();
	}).on('init'),

	hasLoadedDOM: Ember.on('didInsertElement', function()
	{
		this.renderTemplates();
	}),

	renderTemplates: function()
	{
		const list = this.$();
		if(list && list.find)
		{
			const row = Ember.$(list.find('section').children().get(1));
			if(row.children && row.children().length > 0)
			{
				const cols = row.children();
				const headerList = [];

				Ember.$.each(cols, (key, item) => {
					let el = Ember.$(item);
					if(el.attr('title') !== undefined)
					{
						headerList.pushObject(Ember.Object.create({title: el.attr('title'), class: el.attr('class')}));
					}
				});

				if(Ember.get(headerList, "length") > 0)
				{
					this.set('headerItems', headerList);
				}
			}
		}
	},

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
