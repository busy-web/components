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

	actions: {
		runAction(value)
		{
			this.set('result', 'You selected ' + value +'!');
		}
	}
});