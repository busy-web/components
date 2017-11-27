/**
 * @module controllers
 *
 */
import Controller from '@ember/controller';

/**
 * `Controller/Index`
 *
 */
export default Controller.extend({
	isChecked: false,
	result: null,
	headerItems: null,

	init() {
		this._super();
		this.set('headerItems', ['Name', 'Occupation', 'Age']);
	},

	actions: {
		runAction(value) {
			this.set('result', 'You selected ' + value +'!');
		}
	}
});
