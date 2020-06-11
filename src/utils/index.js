export function getmaxAndminObj(row, max, min) {
	let n = row.rowIndex,
		mx = max.rowIndex,
		mi = min.rowIndex
	if (n > mx) {
		return {
			min: mi,
			max: n,
		}
	} else if (n < mx && n > mi) {
		return {
			min: mi,
			max: n,
		}
	} else if (n < mi) {
		return {
			min: n,
			max: mx,
		}
	} else if (n == mi || n == mx) {
		return {
			min: mi,
			max: mx,
		}
	}
}

export function hasOwn(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key)
}

export function mergeOptions(defaults, config) {
	const options = {}
	let key
	for (key in defaults) {
		options[key] = defaults[key]
	}
	for (key in config) {
		// if (hasOwn(config, key)) {
		const value = config[key]
		if (typeof value !== 'undefined') {
			options[key] = value
		}
		// }
	}
	return options
}

export function isHasValue(v) {
	if (['boolean', 'number', 'function'].indexOf(typeof v) > -1) return true
	if (isArray(v) && v.length === 0) return false
	if (isObject(v) && Object.keys(v).length === 0) {
		return false
	}
	if (!v) return false
	return true
}

// types
export function isString(obj) {
	return Object.prototype.toString.call(obj) === '[object String]'
}

export function isArray(arr) {
	return Object.prototype.toString.call(arr) === '[object Array]'
}

export function isObject(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]'
}

export const isFunction = functionToCheck => {
	return typeof functionToCheck === 'function'
}
