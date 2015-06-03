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

	invalidError: 'Password must contain at least one number and one letter and be at least 6 characters long',

	placeholder: 'Password',
});
