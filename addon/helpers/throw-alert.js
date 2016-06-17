import Ember from 'ember';

export function throwAlert(params/*, hash*/) {
	console.log(params);
	return function(model) {
		let str = '';
		for(let i in params)
		{
			if(/%/.test(params[i]))
			{
				let val = Ember.get(model, params[i].replace(/%/, ''));
				if(val)
				{
					str += ' ' + val;
				}
				else
				{
					str += ' ' + params[i];
				}
			}
			else
			{
				str += ' ' + params[i];
			}
		}

		window.alert(str);
	};
}

export default Ember.Helper.helper(throwAlert);
