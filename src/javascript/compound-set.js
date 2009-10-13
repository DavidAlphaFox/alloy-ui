AUI().add(
	'compound-set',
	function(A) {
		var Lang = A.Lang;

		var CompoundSet = function() {
			CompoundSet.superclass.constructor.apply(this, arguments);
		};

		CompoundSet.NAME = 'compoundset';

		CompoundSet.ATTRS = {
			keys: {
				getter: function(value) {
					var instance = this;

					return A.Object.keys(instance.collection);
				}
			},

			first: {
				getter: function() {
					var instance = this;

					var values = instance.get('values');

					return values[0];
				}
			},

			includeFunctions: {
				value: false
			},

			items: {
				value: null,
				getter: function() {
					var instance = this;

					return instance.collection || {};
				}
			},

			last: {
				getter: function() {
					var instance = this;

					var values = instance.get('values');

					return values[values.length - 1];
				}
			},

			getKey: {
				value: null,
				getter: function(value) {
					var instance = this;

					return value || instance.getKey;
				},
				setter: function(value) {
					var instance = this;

					if (Lang.isFunction(value)) {
						instance.getKey = value;
					}

					return instance.getKey;
				}
			},

			values: {
				getter: function(value) {
					var instance = this;

					return instance.values;
				},
				readOnly: true
			}
		};

		A.extend(
			CompoundSet,
			A.Base,
			{
				initializer: function() {
					var instance = this;

					instance.collection = {};
					instance.values = [];

					instance.length = 0;
				},

				add: function(key, obj) {
					var instance = this;

					if (arguments.length == 1) {
						obj = key;
						key = instance.getKey(obj);
					}

					var includeFunctions = instance.get('includeFunctions');

					if (!Lang.isNull(key) && !Lang.isUndefined(key)) {
						var prevVal = instance.collection[key];

						if (!Lang.isUndefined(prevVal)) {
							return instance.replace(key, obj);
						}

						if (includeFunctions || !Lang.isFunction(obj)) {
							instance.collection[key] = obj;
						}
					}

					instance.values.push(obj);

					instance.fire(
						'add',
						{
							index: instance.length,
							attrName: key,
							newVal: obj
						}
					);

					instance.length++;
				},

				addAll: function(obj) {
					var instance = this;

					var args = arguments;
					var length = args.length;

					if (length == 1) {
						args = obj;
					}

					if (length > 1 || Lang.isArray(obj)) {
						length = args.length;

						for (var i = 0; i < length; i++) {
							instance.add(args[i]);
						}
					}
					else {
						for (var i in obj) {
							var item = obj[i];

							instance.add(i, item);
						}
					}
				},

				clear: function() {
					var instance = this;

					instance.collection = {};
					instance.values = [];
					instance.length = 0;

					instance.fire('clear');
				},

				clone: function() {
					var instance = this;

					var clone = new CompoundSet();

					clone._collection = A.Object(instance.collection);
					clone.length = instance.length;
					clone.set('getKey', instance.get('getKey'));

					return clone;
				},

				contains: function(obj) {
					var instance = this;

					return instance.indexOf(obj) > -1;
				},

				containsKey: function(key) {
					var instance = this;

					return !(Lang.isUndefined(instance.collection[key]))
				},

				each: function(fn, context) {
					var instance = this;

					return A.Array.each(instance.values, fn, context);
				},

				eachKey: function(fn, context) {
					var instance = this;

					var keys = instance.get('keys');

					return A.Array.each(keys, fn, context);
				},

				filter: function(fn, context) {
					var instance = this;

					var filtered = new CompoundSet();

					filtered.set('getKey', instance.get('getKey'));

					var collection = instance.collection;
					var keys = instance.get('keys');
					var values = instance.values;

					context = context || instance;

					var filteredCompoundSet = filtered.collection;
					var filteredValues = filtered.values;

					var length = values.length;
					var item;

					for (var i = 0; i < length; i++) {
						item = values[i];

						if (fn.call(context, item, i, collection)) {
							filtered.add(keys[i], item);
						}
					}

					filtered.length = filteredValues.length;

					return filtered;
				},

				filterBy: function(key, value, startsWith, caseSensitive) {
					var instance = this;

					if (Lang.isUndefined(value) ||
					 	Lang.isNull(value) ||
						((Lang.isArray(value) ||
							Lang.isString(value)) && !value.length)) {

						return instance.clone();
					}

					value = instance._generateRegEx(value, startsWith, caseSensitive);

					var keyFilter = A.bind(instance._keyFilter, instance, key, value);

					return instance.filter(keyFilter);
				},

				find: function(fn, context) {
					var instance = this;

					return A.Array.find(instance.values, fn, context);
				},

				findIndex: function(fn, context, start) {
					var instance = this;

					var collection = instance.collection;
					var values = instance.values;
					var length = instance.length;

					start = start || 0;

					for (var i = start; i < length; i++) {
						if (fn.call(context, values[i], i, collection)) {
							return i;
						}
					}

					return -1;
				},

				findIndexBy: function(key, value, start, startsWith, caseSensitive) {
					var instance = this;

					if (Lang.isUndefined(value) ||
					 	Lang.isNull(value) ||
						((Lang.isArray(value) ||
							Lang.isString(value)) && !value.length)) {

						return -1;
					}

					value = instance._generateRegEx(value, startsWith, caseSensitive);

					var keyFilter = A.bind(instance._keyFilter, instance, key, value);

					return instance.findIndex(keyFilter, null, start);
				},

				getKey: function(obj) {
					var instance = this;

					return (obj.get && obj.get('id')) || obj.id;
				},

				indexOf: function(obj) {
					var instance = this;

					var values = instance.get('values');

					return A.Array.indexOf(values, obj);
				},

				indexOfKey: function(key) {
					var instance = this;

					var keys = instance.get('keys');

					return A.Array.indexOf(keys, key);
				},

				insert: function(index, key, obj) {
					var instance = this;

					if (arguments.length == 2) {
						obj = arguments[1];
						key = instance.getKey(obj);
					}

					if (instance.containsKey(key)) {
						instance.removeKey(key);
					}

					if (index >= instance.length) {
						return instance.add(key, obj);
					}

					instance.values.splice(index, 0, obj);

					instance.length++;

					if (!Lang.isUndefined(key) && !Lang.isNull(key)) {
						instance.collection[key] = obj;
					}

					instance.fire(
						'add',
						{
							index: instance.length,
							attrName: key,
							newVal: obj
						}
					);
				},

				item: function(key) {
					var instance = this;

					var item;

					if (Lang.isNumber(key)) {
						var values = instance.get('values');

						item = values[key];
					}
					else {
						item = instance.collection[key];
					}

					return item;
				},

				keySort: function(direction, fn) {
					var instance = this;

					instance._sortBy('key', direction, fn || instance._keySorter);
				},

				remove: function(obj) {
					var instance = this;

					var index = instance.indexOf(obj);

					return instance.removeAt(index);
				},

				removeAt: function(index) {
					var instance = this;

					if (index < instance.length && index >= 0) {
						var collection = instance.collection;
						var values = instance.values;

						var obj = values[index];

						values.splice(index, 1);

						var keys = instance.get('keys');
						var key = keys[index];

						if (!Lang.isUndefined(key)) {
							delete collection[key];
						}

						instance.length--;
					}
				},

				removeKey: function(key) {
					var instance = this;

					var index = instance.indexOfKey(key);

					return instance.removeAt(index);
				},

				replace: function(key, obj) {
					var instance = this;

					if (arguments.length == 1) {
						obj = key;
						key = instance.getKey(obj);
					}

					var prevVal = instance.collection[key];

					if (Lang.isUndefined(key) || Lang.isNull(key) || Lang.isUndefined(prevVal)) {
						return instance.add(key, obj);
					}

					var index = instance.indexOfKey(key);

					instance.collection[key] = obj;

					instance.fire(
						'replace',
						{
							attrName: key,
							prevVal: prevVal,
							newVal: obj
						}
					);
				},

				size: function() {
					var instance = this;

					return instance.length;
				},

				slice: function(start, end) {
					var instance = this;

					var values = instance.get('values');

					return values.slice.apply(values, arguments);
				},

				sort: function(direction, fn) {
					var instance = this;

					instance._sortBy('value', direction, fn);
				},

				_generateRegEx: function(value, startsWith, caseSensitive) {
					var instance = this;

					if (!(value instanceof RegExp)) {
						value = String(value);

						var regExBuffer = [];

						if (startsWith !== false) {
							regExBuffer.push('^');
						}

						regExBuffer.push(value);

						var options;

						if (!caseSensitive) {
							options = 'i';
						}

						value = new RegExp(regExBuffer.join(''), options);
					}

					return value;
				},

				_keyFilter: function(key, value, item, index, collection) {
					var instance = this;

					return item && value.test(item[key]);
				},

				_keySorter: function(a, b) {
					var instance = this;

					var keyA = String(a).toLowerCase();
					var keyB = String(b).toLowerCase();

					var returnValue = 0;

					if (keyA > keyB) {
						returnValue = 1;
					}
					else if (keyA < keyB) {
						returnValue = -1;
					}

					return returnValue;
				},

				_sortBy: function(property, direction, fn) {
					var instance = this;

					var asc = 1;
					var tempValues = [];
					var keys = instance.get('keys');
					var values = instance.values;

					var length = values.length;

					fn = fn || A.Array.numericSort;

					if (String(direction).toLowerCase() == 'desc') {
						asc = -1;
					}

					for (var i = 0; i < length; i++) {
						tempValues.push(
							{
								key: keys[i],
								value: values[i],
								index: i
							}
						);
					}

					tempValues.sort(
						function(a, b) {
							var value = fn(a[property], b[property]) * asc;

							if (value === 0) {
								value = 1;

								if (a.index < b.index) {
									value = -1;
								}
							}

							return value;
						}
					);

					length = tempValues.length;

					var collection = {};

					for (var i = 0; i < length; i++) {
						var item = tempValues[i];
						var key = item.key;
						var value = item.value;

						values[i] = value;
						collection[key] = value;
					}

					instance.collection = collection;

					instance.fire('sort');
				}
			}
		);

		A.CompoundSet = CompoundSet;
	},
	'@VERSION',
	{
		requires: ['oop', 'collection', 'base'],
		use: []
	}
);