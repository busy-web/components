/**
 * @module components
 *
 */
import BCValidate from './bc-validate';

/**
 * `BusyComponents/Component/BCValidatePassword`
 *
 */
export default BCValidate.extend({
	validateExpression: /^(?=.*[0-9])(?=.*[a-zA-Z])(\w|[!@#$%^&*?_~-]).{5,}$/,

	type: 'password',

	invalidError: 'Password must contain a number, a letter, and be more than 6 characters long.',

	placeholder: 'Password',
});
