import Ember from 'ember';

const DefinedProperty = Ember.Object.extend({
	type: '',
	name: '',
	isProperty: false,
	isMethod: false,
	isPublic: false,
	isPrivate: false,
	isProtected: false,
	params: null,
	desc: null,
	return: null
});

function getClassString(text, className) {
	// get class name regex
	const path = new RegExp('define..busy-components\/' + className);

	// remove everything before the class define
	let idx = text.search(path);
	text = text.slice(idx + 6);

	// remove the class define to the exports
	idx = text.search("exports\\['default'\\]");
	text = text.slice(idx);

	// remove everything after the next define(
	idx = text.search(/define\(/);
	text = text.slice(0, idx);

	// remove anything left ofer after this class
	idx = text.lastIndexOf('});');
	text = text.slice(0, idx);

	// return text
	return text;
}

function parseComments(text) {
	const data = [];
	const reg = new RegExp("\\/\\*\\*((?!\\*\\/)[\\s\\S])*\\*\\/", 'g', 'm');
	text.replace(reg, function(str) {
		str = str.replace(/\n|\t/g, '').replace(/\/\*|\*\//g, '').replace(/\*\*/g, '*');
		const prop = DefinedProperty.create({ params: [], desc: [] });

		str.replace(/\*([^\*]*)/g, function(line, val) {
			val = val.trim();
			if (/^@public/i.test(val)) {
				prop.set('isPublic', true);
			} else if (/^@private/i.test(val)) {
				prop.set('isPrivate', true);
			} else if (/^@protected/i.test(val)) {
				prop.set('isProtected', true);
			} else if (/^@method/.test(val)) {
				prop.set('isMethod', true);
				prop.set('name', val.replace(/^@method/, '').trim());
			} else if (/^@property/.test(val)) {
				prop.set('isProperty', true);
				prop.set('name', val.replace(/^@property/, '').trim());
			} else if (/^@type/i.test(val)) {
				let obj = { name: '', desc: '' };
				val.replace(/^@type/, '').trim().replace(/^\{([^\}]*)\} ?([\s\S]*)$/g, function(...args) {
					obj.name = (args[1] ? args[1] : '');
					obj.desc = (args[2] ? args[2] : '');
				});
				prop.set('type', obj);
			} else if (/^@params?/.test(val)) {
				val = val.replace(/^@params?/, '').trim();
				const obj = { name: '', type: '', desc: ''};
				val.replace(/^([^ ]*) ?\{([^\}]*)\} ?([\s\S]*)$/, function(...args) {
					obj.name = (args[1] ? args[1] : '');
					obj.type = (args[2] ? args[2] : '');
					obj.desc = (args[3] ? args[3] : '');
				});
				prop.get('params').pushObject(obj);
			} else if (/^@returns?/.test(val)) {
				val = val.replace(/^@returns?/, '').trim();
				const obj = { type: '', desc: '' };
				val.replace(/^\{([^\}]*)\} ?[\s\S]*$/, function(...args) {
					obj.type = (args[1] ? args[1] : '');
					obj.desc = (args[2] ? args[2] : '');
				});
				prop.set('return', obj);
			} else {
				if (!Ember.isEmpty(val)) {
					prop.get('desc').push(val);
				}
			}
		});

		data.pushObject(prop);
	});
	return data;
}

function log(...args) {
	window.console.log(...args);
}

function logMethods(data) {
	log('%cMethods', 'padding-left:20px;color:#6f6f6f;font-size:16px');

	const propLogger = function(name='', desc=[], type='', typeDef='', params=[]) {
		log(`%c${name} %c${type} %c${Ember.String.capitalize(typeDef)}`, 'padding-left:60px;color:#64b160;font-size:12px;', 'color:#a28800;font-size:12px;', 'color:#6e6e6e;font-size:12px;');
		desc.forEach(d => log(`%c${d}`, 'padding-left:80px;padding-bottom:15px;color:#8e8e8e;'));
		log('%cParams:', 'color:#6f6f6f;padding-left:80px');
		params.forEach(item => {
			log('%c' + item.name + ' %c' + item.type + ' %c' + Ember.String.capitalize(item.desc), 'padding-left:100px;color:#6a95b9', 'color:#a28800;', 'color:#8e8e8e;');
		});
	};

	const _private = data.filterBy('isPrivate');
	const _protected = data.filterBy('isProtected');
	const _public = data.filterBy('isPublic');

	if (_private.get('length')) {
		log('%cPrivate', 'padding-left:40px;color:#d65151;font-size:10px;text-decoration:underline;');
		_private.forEach(item => propLogger(item.get('name'), item.get('desc'), item.get('return.type'), item.get('return.desc'), item.get('params')));
	}

	if (_protected.get('length')) {
		log('%cProtected', 'padding-left:40px;color:#fcbf12;font-size:10px;text-decoration:underline;');
		_protected.forEach(item => propLogger(item.get('name'), item.get('desc'), item.get('return.type'), item.get('return.desc'), item.get('params')));
	}

	if (_public.get('length')) {
		log('%cPublic', 'padding-left:40px;color:#798fa7;font-size:10px;text-decoration:underline;');
		_public.forEach(item => propLogger(item.get('name'), item.get('desc'), item.get('return.type'), item.get('return.desc'), item.get('params')));
	}
}

function logProps(data) {
	log('%cProperties', 'padding-left:20px;color:#6f6f6f;font-size: 16px');

	const propLogger = function(name='', desc=[], type='', typeDef='') {
		log(`%c${name} %c${type} %c${Ember.String.capitalize(typeDef)}`, 'padding-left:60px;color:#64b160;font-size:12px;', 'color:#a28800;font-size:12px;', 'color:#6e6e6e;font-size:12px;');
		desc.forEach(d => log(`%c${d}`, 'padding-left:80px;padding-bottom:15px;color:#8e8e8e;'));
	};
	const _private = data.filterBy('isPrivate');
	const _protected = data.filterBy('isProtected');
	const _public = data.filterBy('isPublic');

	if (_private.get('length')) {
		log('%cPrivate', 'padding-left:40px;color:#d65151;font-size:10px;text-decoration:underline;');
		_private.forEach(item => propLogger(item.get('name'), item.get('desc'), item.get('type.name'), item.get('type.desc')));
	}

	if (_protected.get('length')) {
		log('%cProtected', 'padding-left:40px;color:#fcbf12;font-size:10px;text-decoration:underline;');
		_protected.forEach(item => propLogger(item.get('name'), item.get('desc'), item.get('type.name'), item.get('type.desc')));
	}

	if (_public.get('length')) {
		log('%cPublic', 'padding-left:40px;color:#798fa7;font-size:10px;text-decoration:underline;');
		_public.forEach(item => propLogger(item.get('name'), item.get('desc'), item.get('type.name'), item.get('type.desc')));
	}
}

function logComments(className, data) {
	const props = data.filterBy('isProperty', true);
	const methods = data.filterBy('isMethod', true);

	log('\n\n');
	log('%c----------------------------------------------------------------------', 'color:#30aeef');
	log('%c' + className, 'padding-left:20px;color:#30aeef;font-size:20px;')
	log('%c----------------------------------------------------------------------', 'color:#30aeef');
	log('\n\n');

	// log properties
	logProps(props);

	log('\n\n')

	// log methods
	logMethods(methods);

	log('\n\n');
	log('%c----------------------------------------------------------------------', 'color:#30aeef');
	log('\n\n');
}

export default Ember.Mixin.create({
	__help: false,

	__displayHelp: Ember.on('init', function() {
		if (this.get('__help')) {
			if (!Ember.isEmpty(this.get('_debugContainerKey'))) {
				const parts = this.get('_debugContainerKey').split(':');
				const host = window.location.href;
				Ember.$.ajax({
					url: host + 'assets/vendor.js',
					dataType: 'text'
				}).done(text => {
					// parse the file for the class
					text = getClassString(text, parts.join('s\/'));

					// get comment data
					const data = parseComments(text);

					logComments(parts[1], data);
				});
			}
		}
	})
});
