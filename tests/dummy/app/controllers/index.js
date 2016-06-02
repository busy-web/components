/**
 * @module controllers
 *
 */
import Ember from 'ember';

/**
 * `Controller/Index`
 *
 */
export default Ember.Controller.extend(
{
	isChecked: false,
	result: null,
	headerItems: null,

	init()
	{
		this._super();
		this.set('headerItems',[
			'Name',
			'Occupation',
			'Age'
		]);
	},

	actions: {
		runAction(value)
		{
			this.set('result', 'You selected ' + value +'!');
		}
	}
});