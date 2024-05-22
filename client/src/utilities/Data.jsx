// Utility functions centered around providing helpers for managing and transforming data related to databases, particularly MongoDB / Mongoose setups.
import * as utils from "./";
const debug = false;

export const getType = (value) => {
	// More useful version of vanilla javascript's typeof.
	// Somewhat specialized to my applications as I deal with a lot of dynamic element construction based on the types of data passed in, but this can be expended.
	if (value === undefined) {
		return "undefined";
	} else if (value === null) {
		return "null";
	} else if (typeof value === "object" && Array.isArray(value)) {
		// Value is an array.
		if (utils.val.isValidArray(value, true)) {
			// An array of what?
			let test = value[0];
			// Get the datatype of the array's element to see if it's a scalar array or object array.
			return `[${getType(test)}]`;
		} else {
			return "array";
		}
		// Value is a nested object array.
	} else if (utils.val.isObject(value) && !utils.val.isArray(value)) {
		// Value is an object.
		return "object";
	} else {
		// Value is a scalar of some kind. Dig into the specific type.
		if (typeof value === "string") {
			// Value is a String.
			return "string";
		} else if (utils.val.isNumber(value)) {
			// Value is a Number.
			return "number";
		} else if (value === true || value === false) {
			// Value is a Boolean.
			return "boolean";
		} else {
			return "invalid";
		}
	}
};

export const getFieldType = (value) => {
	// More useful version of vanilla javascript's typeof.
	if (typeof value === "object" && Array.isArray(value)) {
		// Value is an array.
		if (utils.val.isValidArray(value, true)) {
			let test = value[0];
			// Get the datatype of the array's element to see if it's a scalar array or object array.
			if (typeof test === "object") {
				// Value is an array of nested objects.
				// return "list";
				return "data";
			} else if (Array.isArray(test)) {
				// Value is an array of arrays.
				// return "list";
				return "data";
			} else if (["string", "number", "boolean"].includes(typeof test)) {
				// zValue is an array of scalars.
				return getFieldType(test);
			}
		} else {
			// Value is an empty array, but an array nonetheless.
			return "array";
		}
		// Value is a nested object array.
	} else if (utils.val.isObject(value) && !utils.val.isArray(value)) {
		// Value is an object.
		return "data";
	} else {
		// Value is a scalar of some kind. Dig into the specific type.
		// if (utils.val.isString(value)) {
		if (typeof value === "string") {
			// Value is a String.
			return "text";
		} else if (utils.val.isNumber(value)) {
			// Value is a Number.
			return "number";
			// } else if (utils.val.isBool(value)) {
		} else if (value === true || value === false || value === "true" || value === "false") {
			// Value is a Boolean.
			return "checkbox";
		} else {
			// I dunno lol.
			// return '';
			return "invalid";
		}
	}
};


export const getArrayType = (value) => {
	let type;
	// Test the types of a given array and return what type of an array this is.
	if (typeof value === "object" && Array.isArray(value)) {
		// Value is an array.
		type = "array";
		if (utils.val.isValidArray(value, true)) {
			// An array of what?
			let subtype;
			value.forEach( ( element, index ) =>
			{
				let elementType = utils.data.getType( element );
				if ( !subtype ) { subtype = elementType; }
				else if ( subtype )
				{
					if ( subtype !== "mixed" )
					{
						if ( elementType !== subtype )
						{
							subtype = "mixed";
						}
					}
				}
			});
			return `[${utils.data.getType(test)}]`;
		} else {
			return "array";
		}
		// Value is a nested object array.
	} else {
		// Value is not an array.
		type = "";
	}
	return type;
};


export const formatInputValue = ( e, fieldType = 'text' ) =>
{
    // console.log("utils.val.formatInputValue", "\n :: e = ", e, "\n :: fieldType = ", fieldType);
    // Function exclusively for handling form inputs.
    return fieldType === `checkbox`
        ? e.target.checked
            ? e.target.checked === true
            : false
        : fieldType === `number`
            ? parseInt( e.target.value )
            : fieldType === `text`
                ? e.target.value
                : fieldType === `select` ? e
                : fieldType === `date` ? (new Date( e.target.value.split( "-" ) ).getTime()) : e.target.value;
}

export const initializeModel = (input) => {
	// console.log("Data.js :: initializeModel() :: input = ", input);
	let model;

	if (utils.val.isValidArray(input, true)) {
		model = utils.ao.cleanJSON(input[0]);
	} else if (utils.val.isObject(input)) {
		model = utils.ao.cleanJSON(input);
	}
	// console.log("Data.js :: initializeModel() :: model: ", model);
	return model;
};

// Source: https://masteringjs.io/tutorials/fundamentals/enum
export function arrayToEnum(input) {
	const enumObject = {};
	for (const val of input) {
		enumObject[val] = val;
	}
	return Object.freeze(enumObject);
}

export const typeToInitialDefault = (type, defaultValue) => {
	// if (debug) console.log("Utils.data.typeToInitialDefault :: type = ", type, " :: defaultValue = ", defaultValue);
	return defaultValue
		? defaultValue
		: type === "string"
		? ""
		: type === "number"
		? 0
		: type === "boolean"
		? false
		: type === "date"
		? Date.now()
		: type === "objectid"
		? {
				_id: "",
		  }
		: type === "object"
		? {}
		: type === "array"
		? []
		: type.includes("[") && type.includes("]") // type === "[string]"
		? `[${typeToInitialDefault(utils.str.replaceMultiple(type, { "[": "", "]": "" }))}]`
		: // ? [""]
		  // : type === "[number]"
		  // ? [0]
		  // : type === "[boolean]"
		  // ? [false]
		  // : type === "[date]"
		  // ? [Date.now()]
		  ""; // : schemaToFormModel(fieldSchema, initializeRandom);
};

export const dataType2fieldType = (dataType) => {
	// if (debug) console.log("Utils.data.dataType2fieldType :: dataType = ", dataType);
	const validInputTypes = [
		"button",
		"checkbox",
		"color",
		"date",
		"datetime-local",
		"email",
		"file",
		"hidden",
		"image",
		"month",
		"number",
		"password",
		"radio",
		"range",
		"reset",
		"search",
		"submit",
		"tel",
		"text",
		"time",
		"url",
		"week",
	];

	return dataType === "string"
		? "text"
		: dataType === "number"
		? "number"
		: dataType === "boolean"
		? "checkbox"
		: dataType === "date"
		? "date"
		: dataType === "datetime"
		? "datetime-local"
		: dataType === "objectid"
		? "text"
		: dataType === "object"
		? "data"
		: dataType === "array"
		? "array"
		: dataType === "[string]"
		? "[string]" // [""]
		: dataType === "[number]"
		? "[number]" // [0]
		: dataType === "[boolean]"
		? "[boolean]" // [false]
		: dataType === "[date]"
		? "[date]" // [Date.now()]
		: "text"; // : schemaToFormModel(fieldSchema, initializeRandom);
};

export const generateRandom = (type, length = 10, complexity) => {
	// Set type to lowercase.
	if (!type) return "";
	type = type.toLowerCase();
	// let options = ["[string]", "[number]", "[boolean]", "[date]", "string", "number", "boolean", "date"];
	// let validTypes = ["string", "number", "boolean", "date"];
	// let validarrayTypes = ["array", "[array]", "[string]", "[number]", "[boolean]", "[date]"];
	// console.log("generateRandom called :: type = |", type, "| :: length = ", length, " :: complexity = ", complexity);
	if (["[string]", "[number]", "[boolean]", "[date]", "array"].includes(type)) {
		let nonarrayOptions = ["string", "number", "boolean", "date"];
		// if (debug) console.log(`generateRandom for array data = `, generateRandom(`${nonarrayOptions[Math.floor(Math.random() * nonarrayOptions.length)]}`, length, complexity));
	}
	return type === "string"
		? (Math.random() + 1).toString(36).slice(2, 7) // .substring(7) // [...array(30)].map(() => Math.random().toString(36)[2]).join("")
		: type === "number"
		? Math.floor(Math.random() * (length * length))
		: type === "boolean"
		? Math.floor(Math.random() * 1) === 1
		: type === "date"
		? Date.now() - Math.floor(Math.random()) * length
		: // : type === "UUID"
		// ? crypto.randomBytes(complexity).toString("hex")
		type === "array"
		? Array(length + 1)
				.fill()
				.map(() => {
					let options = ["string", "number", "boolean", "date"];
					return generateRandom(options[Math.floor(Math.random() * options.length)], length);
				})
		: type === "[array]"
		? [...Array(length + 1)].map(() => {
				let options = ["[string]", "[number]", "[boolean]", "[date]"];
				return generateRandom(options[Math.floor(Math.random() * options.length)], length);
		  })
		: type === "[string]"
		? [...Array(length + 1)].map(() => generateRandom("string", length))
		: type === "[number]"
		? [...Array(length + 1)].map(() => generateRandom("number", length))
		: type === "[boolean]"
		? [...Array(length + 1)].map(() => generateRandom("boolean", length))
		: type === "[date]"
		? [...Array(length + 1)].map(() => generateRandom("date", length))
		: 0;
	//{}; // schemaToModel( value )
};

// Initializes a value based on its type.
// export const typeToInitialDefault = (type, defaultValue) => {
// 	return defaultValue
// 		? defaultValue
// 		: type === "string"
// 		? ""
// 		: type === "number"
// 		? 0
// 		: type === "boolean"
// 		? false
// 		: type === "date"
// 		? Date.now()
// 		: type === "array"
// 		? []
// 		: schemaToModel(type);
// };

// Like schemaToModel, except that it produces a JSON model specifically geared towards generating a dynamic form.
export const schemaToFormModel = (schema, initializeRandom = false) => {
	if (debug)
	console.log(`schemaToFormModel called :: schema = `, schema);
	// A model will be an object, with each key value pair having a nested object.
	let model = {};
	if (utils.val.isArray(schema)) {
		// Use only the first item, if it has any.
		if (utils.val.isValidArray(schema, true)) {
			let value = schema[0];
			let type = typeof value;
			let typeName = value.hasOwnProperty("instance") ? value.instance : undefined;
			// If the testValue is an object, we need to run this recursively. Else, just return an array with a single value initialized inside it.
			if ( debug )
			console.log(`schemaToFormModel :: schema = `, schema, "\n :: value = ", value, "\n :: type = ", type, "\n :: typeName = ", typeName);
			model = [
				typeName === "string"
					? ""
					: typeName === "number"
					? 0
					: typeName === "boolean"
					? false
					: typeName === "date"
					? Date.now()
					: schemaToFormModel(value, initializeRandom),
			];
		} else {
			model = [];
		}
	} else if (utils.val.isObject(schema)) {
		Object.keys(schema).forEach((key, index) => {
			let value = schema[key];
			if (value) {
				let type = value.hasOwnProperty("type") ? value.type : "";
				let typeName = utils.ao.deepGetKey(value, "instance");
				// let typeName = value.hasOwnProperty("instance") ? value.instance : undefined;
				if (typeName) typeName = typeName.toLowerCase();
				let options = utils.ao.deepGetKey(value, "options");
				// Check for enums.
				// let enums = value.hasOwnProperty("enumValues") ? value.enumValues : undefined;
				let enums = utils.ao.deepGetKey(value, "enumValues");
				// ['none', 'low', 'medium', 'high', 'urgent', 'asap', 'critical']
				// ['cancelled', 'postponed', 'waitingrequirements', 'incomplete', 'inprogress', 'completed']
				let defaultValue = utils.ao.has(value, "defaultValue") ? value.defaultValue : undefined;
				let initialValue;
				if (debug) console.log(
					`schemaToFormModel :: schema = `,
					schema,
					"\n :: key = ",
					key,
					"\n :: value = ",
					value,
					"\n :: options = ",
					options,
					"\n :: enums = ",
					enums,
					"\n :: typeName = ",
					typeName,
					"\n :: defaultValue = ",
					defaultValue,
					"\n :: initialValue = ",
					initialValue,
				);
				if (typeof type === "object" && !Array.isArray(type)) {
					// Nested schema, need to dig deeper.
					initialValue = schemaToFormModel(type, initializeRandom);
					if (debug)
					console.log(
						`schemaToFormModel :: schema = `,
						schema,
						"\n :: key = ",
						key,
						"\n :: value = ",
						value,
						"\n :: Type is an object, ie a nested schema. Running this function recursively... ",
						"\n\n :: Initialvalue is now = ",
						initialValue,
					);
				} else if (Array.isArray(type)) {
					// Type is an array of some kind.
					initialValue = schemaToFormModel(type, initializeRandom);
					if (debug)
					console.log(
						`schemaToFormModel :: schema = `,
						schema,
						"\n :: key = ",
						key,
						"\n :: value = ",
						value,
						"\n :: Type is an array, ie a collection of typed data. Running this function recursively... ",
						"\n\n :: Initialvalue is now = ",
						initialValue,
					);
				} else if (typeName) {
					initialValue =
						typeName === "string"
							? utils.ao.has(value, "default")
								? value.default
								: ""
							: typeName === "number"
							? (initialValue = defaultValue ? defaultValue : 0)
							: typeName === "boolean"
							? (initialValue = defaultValue ? defaultValue : false)
							: typeName === "date"
							? (initialValue = defaultValue ? defaultValue : Date.now())
							: typeName === "array"
							? (initialValue = defaultValue ? defaultValue : [])
							: schemaToFormModel(value, initializeRandom);
				}
				model[key] = initialValue;
				if (initializeRandom) {
					if (enums) {
						model[key] = enums[Math.floor(Math.random() * enums.length)];
					} else {
						model[key] = generateRandom(typeName, 10, 10);
					}
				}
				if (debug)
				console.log(
					`schemaToFormModel :: schema = `,
					schema,
					"\n :: key = ",
					key,
					"\n :: value = ",
					value,
					"\n :: After if-else chain: ",
					"\n\n :: Initialvalue is now = ",
					initialValue,
					"\n :: initializeRandom = ",
					initializeRandom,
					"\n :: generateRandom(type, length, complexity) = ",
					generateRandom(typeName, 10, 10),
					"\n :: model[key] = ",
					model[key],
				);
			}
		});
	}
	return model;
};

export const schemaToModel = (schema, initializeRandom = false) => {
	if (debug) console.log(`schemaToModel called :: schema = `, schema);
	// A model will be an object, with each key value pair having a nested object.
	let model = {};
	if (utils.val.isArray(schema)) {
		// Use only the first item, if it has any.
		if (utils.val.isValidArray(schema, true)) {
			let value = schema[0];
			let type = typeof value;
			let typeName = value.hasOwnProperty("name") ? value.name : undefined;
			// If the testValue is an object, we need to run this recursively. Else, just return an array with a single value initialized inside it.
			if (debug) console.log(`schemaToModel :: schema = `, schema, "\n :: value = ", value, "\n :: type = ", type, "\n :: typeName = ", typeName);
			model = [
				typeName === "string" ? "" : typeName === "number" ? 0 : typeName === "boolean" ? false : typeName === "date" ? Date.now() : schemaToModel(value, initializeRandom),
			];
		} else {
			model = [];
		}
	} else if (utils.val.isObject(schema)) {
		Object.keys(schema).forEach((key, index) => {
			let value = schema[key];
			let type = value.hasOwnProperty("type") ? value.type : "";
			let typeName = type.hasOwnProperty("name") ? type.name.toLowerCase() : undefined;
			// Check for enums.
			let enums = value.hasOwnProperty("enum") ? value.enum : undefined;
			// ['none', 'low', 'medium', 'high', 'urgent', 'asap', 'critical']
			// ['cancelled', 'postponed', 'waitingrequirements', 'incomplete', 'inprogress', 'completed']
			if (debug)
				console.log(
					`schemaToModel :: schema = `,
					schema,
					"\n :: key = ",
					key,
					"\n :: value = ",
					value,
					"\n :: Type = ",
					type,
					"\n :: typeof Type = ",
					typeof type,
					"\n :: Array.isArray(type) = ",
					Array.isArray(type),
					"\n :: Type.name = ",
					type.name,
					"\n :: typeName = ",
					typeName,
				);
			let initialValue;
			if (typeof type === "object" && !Array.isArray(type)) {
				// Nested schema, need to dig deeper.
				initialValue = schemaToModel(type, initializeRandom);
				if (debug)
					console.log(
						`schemaToModel :: schema = `,
						schema,
						"\n :: key = ",
						key,
						"\n :: value = ",
						value,
						"\n :: Type is an object, ie a nested schema. Running this function recursively... ",
						"\n\n :: Initialvalue is now = ",
						initialValue,
					);
			} else if (Array.isArray(type)) {
				// Type is an array of some kind.
				initialValue = schemaToModel(type, initializeRandom);
				if (debug)
					console.log(
						`schemaToModel :: schema = `,
						schema,
						"\n :: key = ",
						key,
						"\n :: value = ",
						value,
						"\n :: Type is an array, ie a collection of typed data. Running this function recursively... ",
						"\n\n :: Initialvalue is now = ",
						initialValue,
					);
			} else if (typeName) {
				initialValue =
					typeName === "string"
						? utils.ao.has(value, "default")
							? value.default
							: ""
						: typeName === "number"
						? (initialValue = utils.ao.has(value, "default") ? value.default : 0)
						: typeName === "boolean"
						? (initialValue = utils.ao.has(value, "default") ? value.default : false)
						: typeName === "date"
						? (initialValue = utils.ao.has(value, "default") ? value.default : Date.now())
						: typeName === "array"
						? (initialValue = utils.ao.has(value, "default") ? value.default : [])
						: schemaToModel(value, initializeRandom);
			}
			model[key] = initialValue;
			if (initializeRandom) {
				if (enums) {
					model[key] = enums[Math.floor(Math.random() * enums.length)];
				} else {
					model[key] = generateRandom(typeName, 10, 10);
				}
			}
			if (debug)
				console.log(
					`schemaToModel :: schema = `,
					schema,
					"\n :: key = ",
					key,
					"\n :: value = ",
					value,
					"\n :: After if-else chain: ",
					"\n\n :: Initialvalue is now = ",
					initialValue,
					"\n :: initializeRandom = ",
					initializeRandom,
					"\n :: generateRandom(type, length, complexity) = ",
					generateRandom(typeName, 10, 10),
					"\n :: model[key] = ",
					model[key],
				);
		});
	}
	return model;
};
