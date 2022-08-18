/**
 * @author GeisonJr
 * @version 1.0.0
 * @param value
 */
 export function isAnimation(value: any): value is Animation {
	if (isNullOrUndefined(value))
		return false
	else if (value.constructor.name === 'Animation')
		return true
	else if (value instanceof Animation)
		return true

	return false
}

/**
 * @author GeisonJr
 * @version 1.0.1
 * @param value
 */
export function isArray(value: any): value is Array<any> {
	if (isNullOrUndefined(value))
		return false
	else if (value.constructor.name === 'Array')
		return true
	else if (value instanceof Array)
		return true
	else if (Array.isArray(value))
		return true

	return false
}

/**
 * @author GeisonJr
 * @version 1.0.0
 * @param value
 */
export function isBigInt(value: any): value is BigInt {
	if (isNullOrUndefined(value))
		return false
	else if (value.constructor.name === 'BigInt')
		return true
	else if (typeof value === 'bigint')
		return true
	else if (value instanceof BigInt)
		return true

	return false
}

/**
 * @author GeisonJr
 * @version 1.0.0
 * @param value
 */
export function isBoolean(value: any): value is boolean {
	if (isNullOrUndefined(value))
		return false
	else if (value.constructor.name === 'Boolean')
		return true
	else if (typeof value === 'boolean')
		return true
	else if (value instanceof Boolean)
		return true

	return false
}

/**
 * @author GeisonJr
 * @version 1.0.0
 * @param value
 */
export function isBuffer(value: any): value is Buffer {
	if (isNullOrUndefined(value))
		return false
	else if (value.constructor.name === 'Buffer')
		return true
	else if (value instanceof Buffer)
		return true
	else if (Buffer.isBuffer(value))
		return true

	return false
}

/**
 * @author GeisonJr
 * @version 1.0.0
 * @param value
 */
export function isDate(value: any): value is Date {
	if (isNullOrUndefined(value))
		return false
	else if (value.constructor.name === 'Date')
		return true
	else if (value instanceof Date)
		return true

	return false
}

/**
 * @author GeisonJr
 * @version 1.0.1
 * @param value
 */
export function isElement(value: any): value is Element {
	if (!isNull(value))
		if (isObject(value))
			if ('nodeType' in value)
				if (value.nodeType === Node.ELEMENT_NODE)
					return true

	return false
}

/**
 * @author GeisonJr
 * @version 1.0.0
 * @param value
 */
export function isError(value: any): value is Error {
	if (isNullOrUndefined(value))
		return false
	else if (value.constructor.name === 'Error')
		return true
	else if (value instanceof Error)
		return true

	return false
}

/**
 * @author GeisonJr
 * @version 1.0.0
 * @param value
 */
export function isFunction(value: any): value is Function {
	if (isNullOrUndefined(value))
		return false
	else if (value.constructor.name === 'Function')
		return true
	else if (typeof value === 'function')
		return true
	else if (value instanceof Function)
		return true

	return false
}

/**
 * @author GeisonJr
 * @version 1.0.0
 * @param value
 */
export function isNull(value: any): value is null {
	if (value === null)
		return true

	return false
}

/**
 * @author GeisonJr
 * @version 1.0.0
 * @param value
 */
export function isNullOrUndefined(value: any): value is null | undefined {
	if (isNull(value))
		return true
	else if (isUndefined(value))
		return true

	return false
}

/**
 * @author GeisonJr
 * @version 1.0.0
 * @param value
 */
export function isNumber(value: any): value is Number {
	if (isNullOrUndefined(value))
		return false
	else if (value.constructor.name === 'Number')
		return true
	else if (typeof value === 'number')
		return true
	else if (value instanceof Number)
		return true

	return false
}

/**
 * @author GeisonJr
 * @version 1.0.0
 * @param value
 */
export function isObject(value: any): value is Object {
	if (isNullOrUndefined(value))
		return false
	else if (value.constructor.name === 'Object')
		return true
	else if (typeof value === 'object')
		return true
	else if (value instanceof Object)
		return true

	return false
}

/**
 * @author GeisonJr
 * @version 1.0.0
 * @param value
 */
export function isRegExp(value: any): value is RegExp {
	if (isNullOrUndefined(value))
		return false
	else if (value.constructor.name === 'RegExp')
		return true
	else if (value instanceof RegExp)
		return true

	return false
}

/**
 * @author GeisonJr
 * @version 1.0.0
 * @param value
 */
export function isString(value: any): value is string {
	if (isNullOrUndefined(value))
		return false
	else if (value.constructor.name === 'String')
		return true
	else if (typeof value === 'string')
		return true
	else if (value instanceof String)
		return true

	return false
}

/**
 * @author GeisonJr
 * @version 1.0.0
 * @param value
 */
export function isSymbol(value: any): value is Symbol {
	if (isNullOrUndefined(value))
		return false
	else if (value.constructor.name === 'Symbol')
		return true
	else if (typeof value === 'symbol')
		return true
	else if (value instanceof Symbol)
		return true

	return false
}

/**
 * @author GeisonJr
 * @version 1.0.0
 * @param value
 */
export function isUndefined(value: any): value is undefined {
	if (value === undefined)
		return true
	else if (typeof value === 'undefined')
		return true

	return false
}
