/**
 * @module components
 *
 */
import TorpidValidate from './torpid-validate';

/**
 * `Torpid/Component/TorpidValidatePassword`
 *
 */
export default TorpidValidate.extend(
{
	validateExpression: /^(?=.*[0-9])(?=.*[a-zA-Z])(\w|[!@#$%^&*?_~-]).{5,}$/,

	type: 'password',

	invalidError: 'Password must contain at a number, a letter, and be more than 6 characters long.',

	placeholder: 'Password',
});
