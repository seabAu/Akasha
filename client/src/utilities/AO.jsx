import React from "react";
import { isArray, isJSON, isObject, isString, isValidArray } from "./Val";
import * as utils from "./";

///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////

// Checks if a given value is found in an array of values.
export const isOneOf = (value, list = []) => {
	return list.includes(value);
};

// INPUT SANITATION
export const cleanInvalid = (val, replace) => (val === null || val === undefined || val === "" || val === " " ? replace : val);

export const removeEmpty = (input) => {
	// Utility to remove any empty entries in an array, except for the 0th.
	// console.log("RemoveEmpty :: input = ", input);
	return utils.val.isValidArray(input, true) ? input.filter((val, index) => val !== "" && val !== undefined && val !== null) : input;
};

// Accepts an array and filters out empty or invalid values.
// export const removeEmpty = (arr) => {
// 	return isArray(arr) ? (utils.val.isValidArray(arr) ? arr.filter((a) => a !== null && a !== undefined && a.toString() !== "" && a !== "" && a !== " ") : arr) : arr;
// };

// @Accepts a string and a split value, containing either a single string or an array of strings as separators.
// @Returns an array divided by the split value(s).
export const parseTextToArray = (text, split) => {
	// console.log("parseText2Array :: ", text, split, text.toString(), text.toString().split(split));
	if (!isString(text)) {
		text = text.toString();
	}
	if (split) {
		// if ( typeof split === "string" ) { return text.split( split ); }
		if (isString(split)) {
			return text.toString().split(split);
		} else if (Array.isArray(split)) {
			if (split[0] !== undefined) {
				let temp = text;
				split.forEach((separator, index) => {
					if (separator) {
						temp = temp.replaceAll(separator, "******");
					}
				});
				return temp.split("******");
			}
		}
	}
	return [text];
};

// Filters keys out of a given object.
export const filterKeys = (input, keys = []) => {
	let output = {};
	if (utils.val.isObject(input)) {
		Object.keys(input).forEach((key, index) => {
			if (!keys.includes(key)) {
				output[key] = input[key];
			}
		});
		// return Object.fromEntries( Object.entries( input ).filter( ( [ key ] ) =>
		// {
		//     return key.includes("Name");
		// }));
		return output;
	}
	return input;
};

export const cleanJSON = (input) => {
	// * console.log("AO.js :: cleanJSON()", "\n :: JSON = ", input);
	if (input) {
		if (utils.val.isObject(input) && !utils.val.isArray(input)) {
			// Nested object. Need to go deeper.
			// * console.log( "cleanJSON", "\n :: JSON = ", input, " :: Value is an OBJECT." );
			let cleanedObj = {};
			Object.keys(input).forEach((key, index) => {
				let value = input[key];
				let cleanedValue;
				// * console.log( "cleanJSON", "\n :: JSON = ", input, "\n :: key = ", key, "\n :: value = ", value );
				// Get type of value.
				if (utils.val.isObject(value)) {
					// Nested object. Need to go deeper.
					cleanedValue = cleanJSON(value); // cleanedValue = { ...input[key], [key]: cleanJSON(value) };
				} else if (utils.val.isArray(value)) {
					// Nested array. Need to go deeper.
					// * console.log("cleanJSON", "\n :: JSON = ", input, "\n :: key = ", key, "\n :: value = ", value, " :: Value is an ARRAY.");
					if (utils.val.isValidArray(value, true)) {
						// Has more than one entry.
						let testValue = value[0];
						// input[ key ] = [ cleanJSON( testValue ) ];
						cleanedValue = [cleanJSON(testValue)];
					} else {
						cleanedValue = [];
					}
				} else {
					cleanedValue = cleanJSON(value);
				}
				// Object.defineProperty(input[key], key, {
				//     value: cleanedValue,
				//     writable: true,
				// });
				cleanedObj[key] = cleanedValue;
				// return valToListElement(objKey, objValue, classPrefix, `${parentIndex}-${objIndex}`, expandable, false);
			});
			// * console.log("cleanJSON", "\n :: JSON = ", input, " :: Returning: ", cleanedObj);
			return cleanedObj;
		} else if (utils.val.isArray(input)) {
			// Nested array. Need to go deeper.
			//
			// * console.log( "cleanJSON", "\n :: JSON = ", input, " :: input is an ARRAY." );
			if (utils.val.isValidArray(input, true)) {
				// Has more than one entry.
				let testValue = input[0];
				return [cleanJSON(testValue)];
			} else {
				return [];
			}
		} else if (utils.val.isNumber(input)) {
			return 0;
		} else if (utils.val.isString(input)) {
			return "";
		} else if (utils.val.isBool(input)) {
			return false;
		}
	}
	// * console.log("cleanJSON", "\n :: AFTER = ", input);
	return input;
};

export const SanitizeObj = (obj) => {
	// * console.log("SanitizeObj :: obj = ", obj);
	return Object.keys(obj).forEach((key) => {
		// * console.log("SanitizeObj :: key = ", key, " :: obj[key] = ", obj[key]);

		// Sanitize the value if it's null or undefined.
		// if (
		//     obj[key] === null ||
		//     obj[key] === undefined ||
		//     obj[key] === "" ||
		//     obj[key] === " "
		// ) {
		//     obj[key] = "-";
		// }
		obj[key] = cleanInvalid(obj[key], "-");
		if (obj[key]) {
			if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
				// * console.log("SanitizeObj :: obj has a nested object :: key = ", key, " :: obj[key] = ", obj[key]);
				obj[key] = SanitizeObj(obj[key]);
			} else if (Array.isArray(obj[key])) {
				// * console.log("SanitizeObj :: obj has a nested array :: key = ", key, " :: obj[key] = ", obj[key]);
				obj[key] = SanitizeObjArray(obj[key]);
			}
		} else {
		}
	});
};

export const removeKey = (o, k) => {
	let temp = { ...o };
	if (temp.hasOwnProperty(k)) {
		delete temp[k];
	}
	return temp;
};

// Bit of a goofy function. This takes an array, and turns it into an array of objects with each value assigned and initialized to a specified key.
export const arrayToObjArray = (input = [], key = "") => {
	if (utils.val.isValidArray(input, true)) {
		return input.map((element, index) => {
			return { [key]: element.toString() };
		});
	} else {
		return input;
	}
};

// This runs through an object array and replaces any null, undefined, empty, or otherwise invalid values with a placeholder, to avoid errors.
export const SanitizeObjArray = (objArray) => {
	// * console.log("SanitizeObjectArray() :: objArray = ", objArray);
	let sanitized = objArray.map((object, index) => {
		// * console.log("SanitizeObjArray() :: object = ", object);
		return SanitizeObj(object);
		// Object.entries(object).map(
		//     (objProperty, index) => {
		//         let objKey = objProperty[0];
		//         let objValue = objProperty[1];
		//         if (
		//             typeof objValue === "object" &&
		//             objValue !== null
		//         )
		//         {
		//
		//         } else
		//         {
		//             if ( objValue == null ||
		//                     objValue === undefined ||
		//                     objValue === " " ||
		//                 objValue === "" )
		//             {
		//                 return { objKey: objValue };
		//             }
		//         }
		//     },
		// )
	});
	// * console.log("sanitized = ", sanitized);
	return sanitized;
};

// * Data extraction from objects or arrays * //

export const getDataList = (data, key = "") => {
	let list = [];
	if (utils.val.isValidArray(data, true)) {
		data.forEach((item, index) => {
			if (utils.val.isObject(item)) {
				let val = utils.ao.deepGetKey(item, key);
				if (val && val !== "") {
					list.push(val);
				}
			}
		});
	}
	return list;
};

// Fetches specific keys from an object array.
export const extractDataList = (data, keys = []) => {
	let list = [];
	if (utils.val.isValidArray(data, true)) {
		// Run for each element in the array.
		data.forEach((item, index) => {
			if (utils.val.isObject(item)) {
				// Run for each key given.
				let res = {};
				let skip = false;
				keys.forEach((key, i) => {
					let val = utils.ao.deepGetKey(item, key);
					if (val && val !== "" && val !== "''") {
						// && !isBlank(val)) {
						res[key] = val;
					} else {
						skip = true;
					}
				});
				if (!skip) {
					list.push(res);
				}
				skip = false; // Reset skip temp value.
			}
		});
	}
	// console.log(
	//     "extractDataList :: data = ",
	//     data,
	//     " :: keys = ",
	//     keys,
	//     " :: list results = ",
	//     list,
	// );
	return list;
};

export const getObjKeys = (inputObj) => {
	try {
		return Object.keys(inputObj).map((key, index) => {
			return {
				id: index,
				key: key,
				value: key,
				label: key.replace("_", " ").charAt(0).toUpperCase() + key.replace("_", " ").slice(1),
			};
		});
	} catch (error) {
		return [
			{
				no_data: "No data",
			},
		];
	}
};

// Provided an array, finds one object element with a matching key-value pair, and returns a desired value.
export const findOne = (data = [], key = "", matchValue = "", returnKey = "", matchSubString = false, matchCaseInsensitive = true) => {
	// let found = data.find( ( element ) => { return element[ key ] === matchValue } );
	let found = data.find((element) => {
		let elementValue = element[key];
		if (utils.val.isString(elementValue) && utils.val.isString(matchValue)) {
			if (matchCaseInsensitive) {
				elementValue = elementValue.toString().toLowerCase();
				matchValue = matchValue.toString().toLowerCase();
			}

			if (matchSubString) {
				return elementValue.includes(matchValue);
			} else {
				return elementValue === matchValue;
			}
		} else {
			return elementValue === matchValue;
		}
	});
	//console.log("FindOne :: found = ", found);
	return utils.ao.has(found, returnKey) ? found[returnKey] : found;
};

// Provided an array, finds all object elements with a matching key-value pair, and returns a desired values from each.
export const findAll = (data = [], key = "", matchValue = "", returnKey = "") => {
	let found = [];
	data.forEach((element) => {
		if (element[key] === matchValue) {
			if (utils.ao.has(element, returnKey)) {
				found.push(element[returnKey]);
			} else {
				found.push(element);
			}
		}
		return false;
		// return element.name === matchValue;
	});

	return found;
};

// Source: https://stackoverflow.com/questions/7364150/find-object-by-id-in-an-array-of-javascript-objects
// var array = [{'id':'73','foo':'bar'},{'id':'45','foo':'bar'}];
// var result_obj = objectFindByKey(array, 'id', '45');
// array = [{key:value},{key:value}]
export function objectFindByKey(array, key, value) {
	for (var i = 0; i < array.length; i++) {
		if (array[i][key] === value) {
			return array[i];
		}
	}
	return null;
}

///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// OBJECT & OBJECT-ARRAY MANIPULATION
// This applies the properties of spliceObj to each object in the objArray.
export const SpliceObjArray = (objArray, spliceObj) => {
	if (Array.isArray(objArray)) {
		return objArray.map((obj) => {
			return Object.assign(obj, spliceObj);
		});
	} else {
		// * console.log("OBJUTILS.JS :: SpliceObjArray :: objArray = ", objArray, "\nspliceObj = ", spliceObj, "\nError: Bad input.");
		return objArray;
	}
};
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// OBJECT & OBJECT-ARRAY FLATTENING INTO FLAT OBJECTS
// Array.prototype.flatten = function () {
export const flatten = function () {
	let flatArray = [];
	for (let index = 0; index < this.length; index++) {
		const element = this[index];
		if (Array.isArray(element)) {
			flatArray = flatArray.concat(this.flatten.call(element));
		} else {
			flatArray.push(element);
		}
	}
	return flatArray;
};
// export function flattenFilterAndSort(arr) {
//     let flatArray = [];
//     for (var i = 0; i < arr.length; i++) {
//         if (Array.isArray(arr[i])) {
//             flatArray = flatArray.concat(flatten(arr[i]));
//         } else {
//             flatArray.push(arr[i]);
//         }
//     }
//     return typeof flatArray[0] === "string"
//         ? [...new Set(flatArray)].sort()
//         : [...new Set(flatArray)].sort((num1, num2) => {
//               return num1 - num2;
//           });
// }

// Declare a flatten function that takes
// object as parameter and returns the
// flatten object
export const flattenObj = (obj) => {
	// The object which contains the
	// final result
	let result = {};

	// loop through the object "ob"
	// for (const key in obj) {
	Object.keys(obj).forEach((key) => {
		// Sanitize the value if it's null or undefined.
		if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
			obj[key] = "-";
		}
		if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
			const temp = flattenObj(obj[key]);
			for (const j in temp) {
				// Store temp in result
				result[key + "_" + j] = temp[j];
			}
		}

		// Else store obj[key] in result directly
		else {
			result[key] = obj[key];
		}
	});
	return result;
};

// This flattens an object into HTML elements.
export const _flattenObjArray = (objArray) => {
	// console.log("flattenObjArray(): ", objArray);
	return objArray.map((obj, index) => {
		if (typeof obj === "object") {
			return flattenObj(obj);
		} else if (Array.isArray(obj)) {
			return [...flattenObjArray(obj)];
		} else {
			return obj;
		}
	});
};
export const flattenObjArray = (input) => {
	/// console.log("flattenObjArray(): ", input);
	return input.map((element, index) => {
		if (typeof element === "object" && !Array.isArray(element)) {
			return flattenObj(element);
		} else if (utils.val.isValidArray(element, true)) {
			return [...flattenObjArray(element)];
		} else {
			return element;
		}
	});
};
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// OBJECT & OBJECT-ARRAY FLATTENING INTO HTML ELEMENTS
// This flattens an object into HTML elements.
export const flatMapObjText = (obj) => {
	// console.log("flatMapObjText(): ", obj);
	return Object.entries(obj)
		.map((objProperty) => {
			if (typeof objProperty[1] === "object" && objProperty[1] !== null) {
				return `${flatMapObjText(objProperty[1])}`;
			} else {
				return `${objProperty[0]}: ${objProperty[1]}`;
			}
		})
		.join("");
};

// Source: https://github.com/phuocng/1loc/blob/master/contents/object/get-unique-arr-obj.md
export const getUniqueArrObj = (arrObj, keyUnique) => [...new Map(arrObj.map((item) => [item[keyUnique], item])).values()];

export const pluck = (objs, property) => objs.map((obj) => obj[property]);

export const arrayToObject = (array, keyField) =>
	array.reduce((obj, item) => {
		obj[item[keyField]] = item;
		return obj;
	}, {});

export const arrayToObj = (arr, keyField) => Object.assign({}, ...arr.map((item) => ({ [item[keyField]]: item })));
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// DEEP NESTED OBJECT / ARRAY FILTERING & SORTING

// Sorting function from https://blog.logrocket.com/creating-react-sortable-table/
export const sortDataByKey = (data, key, order = "asc") => {
	// console.log( "sortDataByKey :: ", data, key, order );
	if (key) {
		// console.log( "sortDataByKey :: key is valid :: ", data, key, order );
		const sortedData = [...data].sort((a, b) => {
			// console.log( "sortDataByKey :: key is valid :: sorting now :: ", data, key, order, a, b, a[key], b[key] );
			if (a[key] === null) return 1;
			if (b[key] === null) return -1;
			if (a[key] === null && b[key] === null) return 0;
			if (!a.hasOwnProperty.call(key) && !b.hasOwnProperty.call(key)) return 0;
			return (
				a[key].toString().localeCompare(b[key].toString(), "en", {
					numeric: true,
				}) * (order === "asc" ? 1 : -1)
			);
		});
		return sortedData;
	}
};

export const keySortData = (data, key, order = "asc") => {
	// console.log("sortDataByKey :: ", data, key, order);
	if (key) {
		// console.log("sortDataByKey :: key is valid :: ", data, key, order);
		const sortedData = [...data].sort((a, b) => {
			// console.log("sortDataByKey :: key is valid :: sorting now :: ", data, key, order, a, b, a[key], b[key]);
			// console.log(
			// 	"sortDataByKey",
			// 	" :: a.hasOwnProperty.call(key) = ",
			// 	a.hasOwnProperty.call(key),
			// 	" :: b.hasOwnProperty.call(key) = ",
			// 	b.hasOwnProperty.call(key),
			// 	" :: a.hasOwnProperty(key) = ",
			// 	a.hasOwnProperty(key),
			// 	" :: b.hasOwnProperty(key) = ",
			// 	b.hasOwnProperty(key),
			// );
			if (a[key] === null) return 1;
			if (b[key] === null) return -1;
			if (a[key] === null && b[key] === null) return 0;
			// if (!a.hasOwnProperty.call(key) && !b.hasOwnProperty.call(key)) return 0;
			if (!a.hasOwnProperty(key) && !b.hasOwnProperty(key)) return 0;
			return (
				a[key].toString().localeCompare(b[key].toString(), "en", {
					numeric: true,
				}) * (order === "asc" ? 1 : -1)
			);
		});
		return sortedData;
	}
};

export const filterData = (data, filters) => {
	// Data is an array of objects.
	// Filters is an array of objects consisting only of single key value pairs.
	// console.log(
	//     "FilterData() :: BEFORE :: ",
	//     "\ndata",
	//     data,
	//     "\ndata has ",
	//     data.length,
	//     "elements.",
	// );
	// console.log( "FilterData :: ", filters.length );
	if (filters.length > 0) {
		let filteredData = data;
		// Filters in the format {key: key, value: filterString}.
		filters.forEach((element) => {
			if (element.key && element.value) {
				// Run for each filter.
				let filterKey = element.key;
				let filterValue = element.value.toLowerCase();
				filteredData = filteredData.filter((obj, index) => {
					// Filter for each object in the array.
					if (obj) {
						// Object is valid. Check if it contains the key of the filter we're currently filtering for.
						if (obj.hasOwnProperty(filterKey)) {
							// Object contains the key we're filtering for.
							if (obj[filterKey]) {
								// Object has a valid value.
								if (typeof obj[filterKey] === "object") {
									// The value contained in this key is a nested object. Rather than run through each key value pair recursively, just convert to a string and see if it has the substring we're looking for.
									// return JSON.stringify(obj[filterKey]).toLowerCase().includes(filterValue);
									// return obj[ filterKey ].toString().toLowerCase().includes( filterValue );
									return Object.values(obj[filterKey]).toString().toLowerCase().includes(filterValue);
								} else if (Array.isArray(obj[filterKey])) {
									// The value contained in this key is an array. Have to see if any of its elements contains the value we're looking for.
									return obj[filterKey].some((item) => {
										return item.toLowerCase().includes(filterValue);
									});
								} else {
									// The value contained in this key is anything else; a scalar;
									return obj[filterKey].toString().toLowerCase().includes(filterValue);
								}
							} else {
								// Object does not have a valid value.
								// This could be something like undefined, null, '', or some other invalid value.
								return true;
							}
						} else {
							// Object does not contain the key we're filtering for.
							return true;
						}
					} else {
						// Object is invalid.
						return true;
					}
				});
			}
		});
		// console.log(
		//     "FilterData() :: AFTER :: ",
		//     "\nfilteredData", filteredData,
		//     "\nfilteredData has ", filterData.length, "elements."
		// );
		return filteredData;
	} else {
		// Return data as-is.
		return data;
	}
};

export const filterDataFast = (data, filters) => {
	// Data is an array of objects.
	// Filters is an array of objects consisting only of single key value pairs.
	// console.log(
	//     "FilterData() :: BEFORE :: ",
	//     "\ndata",
	//     data,
	//     "\ndata has ",
	//     data.length,
	//     "elements.",
	// );
	// console.log( "FilterData :: ", filters.length );
	if (filters.length > 0) {
		let filteredData = data;
		// Filters in the format {key: key, value: filterString}.
		filters.forEach((element) => {
			if (element.key && element.value) {
				// Run for each filter.
				let filterKey = element.key;
				let filterValue = element.value.toLowerCase();
				filteredData = filteredData.filter((obj, index) => {
					// Filter for each object in the array.
					if (obj) {
						// Object is valid. Check if it contains the key of the filter we're currently filtering for.
						// To do this quick, just turn the whole object into a string and see if it contains the filter value as a substring.
						// Lol.
						// console.log( "filtering '''''fast''''' :: ", filterKey, filterValue, obj, JSON.stringify(obj) );
						if (obj.hasOwnProperty(filterKey)) {
							return JSON.stringify(obj[filterKey]).toLowerCase().includes(filterValue);
						} else {
							return false;
						}
					} else {
						// Object is invalid.
						return true;
					}
				});
			}
		});
		// console.log(
		//     "FilterData() :: AFTER :: ",
		//     "\nfilteredData", filteredData,
		//     "\nfilteredData has ", filterData.length, "elements."
		// );
		return filteredData;
	} else {
		// Return data as-is.
		return data;
	}
};

///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// DEEP NESTED OBJECT / ARRAY SEARCHING
// Searches through an object and checks if it has the desired key(s).
export const has = (input, search = "") => {
	if (input) {
		if (utils.val.isObject(input)) {
			// Input is an object.
			if (search === "") {
				// If search is left blank, just return obj-is-valid check results.
				return true;
			}
			return input.hasOwnProperty(search);
		} else if (utils.val.isArray(input)) {
			// Input is an array.
			if (input.length > 0) {
				// Arr has at least one element.
				if (input[0] !== undefined) {
					// return input.indexOf(search) >= 0;
					return input.includes(search);
				}
			}
		} else {
			// Input is anything else.
			return valContains(input, search);
		}
	}
	return false;
};

export const __has = (input, search = "") => {
	return input ? (utils.val.isObject(input) ? input.hasOwnProperty(search) : false) : utils.val.isArray(input) ? utils.val.isValidArray(input, true) : valContains(input, search);

	// return input
	//     ? (utils.val.isObject(input))
	//         ? (search === "")
	//             ? (true)
	//             : (input.hasOwnProperty(search))
	//         : (utils.val.isArray(input))
	//         ? (utils.val.isValidArray(input, true))
	//             ? (input.includes(search))
	//             : (false)
	//         : (valContains(input, search))
	//     : (false);
};

// Lodash implementation of object-has:
export function lodash_has(object, key) {
	// hasOwnProperty = Object.prototype.hasOwnProperty
	return object ? hasOwnProperty.call(object, key) : false;
}
// https://github.com/lodash/lodash/blob/master/hasIn.js
export function hasIn(object, key) {
	return object != null && key in Object(object);
}

export const _has = (input, search) => {
	// Trying a simpler method - get all keys of input, and use array.includes.
	if (isValidArray(search, true)) {
		return search.every((str) => (isString(str) ? _has(input, str) : false));
	} else {
		if (isValidArray(input)) {
			return input.every((obj) => (isObject(obj) ? _has(obj, search) : false));
		} else if (isObject(input)) {
			return input ? hasOwnProperty.call(input, search) : false;
		}
	}
	return false;
};

export const hasAll = (input, search) => {
	// Version of has() for searching for multiple keys in one object.
	if (isValidArray(search, true)) {
		// Search is a valid array of keys.
		return search.every((str) => (isString(str) ? hasAll(input, str) : false));
	} else {
		if (isValidArray(input)) {
			return input.every((obj) => (isObject(obj) ? hasAll(obj, search) : false));
		} else if (isObject(input)) {
			return input ? hasOwnProperty.call(input, search) : false;
		}
	}
	return false;
};

// Searches through an array of objects and checks if each has the desired key(s).
export const Has = (input, search) => {
	function _has(object, key) {
		// hasOwnProperty = Object.prototype.hasOwnProperty
		return object ? hasOwnProperty.call(object, key) : false;
	}

	function eachHas(input, search) {
		if (isObject(input)) {
			// Input is an object.
			return input.hasOwnProperty(search);
		} else if (isArray(input)) {
			// Input is an array.
			if (isValidArray(input, true)) {
				// Arr has at least one element.
				// return input.includes(search);
				// let _found = [];
				input.forEach((value, index) => {
					if (isObject(value)) {
						// Value is an object. Check if it contains the key we're looking for.
						if (!_has(value, search)) {
							return false;
						}
					}
				});
				// If we get to this point, every value in [search] was found in the input.
				return true;
			}
			return false;
		} else {
			// Input is anything else.
			let inputstr = isJSON(input) ? JSON.stringify(input) : input.toString();
			let searchstr = isJSON(search) ? JSON.stringify(search) : search.toString();
			return inputstr.toLowerCase().includes(searchstr.toLowerCase());
			// return valContains(input, search);
		}
	}

	// First see what kind of input we're given for the search parameter.
	// It can either be an array of strings or just a string.
	if (isArray(search)) {
		search.forEach((str, index) => {
			if (!eachHas(input, str)) {
				return false;
			}
		});
		// If we get to this point, every value in [search] was found in the input.
		return true;
	} else if (isString(search)) {
		return eachHas(input, search);
	} else {
		// Given nothing, return error.
		// return false;
		throw new Error("ERR :: Has(", input, ", ", search, ") was given invalid arguments.");
	}
};

export const valContains = (input, search) => {
	// console.log(`valContains(${JSON.stringify(input)}, ${search}) :: `);
	let inputstr = JSON.stringify(input);
	let searchstr = JSON.stringify(search);
	return inputstr.toLowerCase().includes(searchstr.toLowerCase());
};

export const objContains = (input, filter) => {
	if (typeof input === "object") {
		// Input is an object
		Object.keys(input).forEach((key) => {
			if (input[key]) {
				let val = input[key];
				if (val.toLowerCase().includes(filter)) {
					return true;
				}
			}
		});
		return false;
	} else if (Array.isArray(input)) {
		// Input is an array.
		return arrayContains(input, filter);
	} else {
		// Input is anything else.
		return input.toString().toLowerCase().includes(filter);
	}
};

export const arrayContains = (input, filter) => {
	if (typeof input === "object") {
		// Input is an object
		return objContains(input, filter);
	} else if (Array.isArray(input)) {
		// Input is an array.
		input.forEach((value, index) => {
			if (typeof value === "object") {
				// Input is an object
				return objContains(value, filter);
			} else if (Array.isArray(value)) {
				// Input is an array.
				return arrayContains(value, filter);
			} else {
				// Input is anything else.
				return value.toString().toLowerCase().includes(filter);
			}
		});
	} else {
		// Input is anything else.
		return input.toString().toLowerCase().includes(filter);
	}
};

/*
    // Deeply search nested objects and return the object or value whose key that matches the search value.
    export const objDeepSearch = (input, search) => {
        // First check if the value even exists in the tree.
        if (valContains(input, search)) {
            if (typeof input === "object") {
                // Input is an object
                Object.keys(input).forEach((key) => {
                    if (input[key]) {
                        console.log(
                            `ObjDeepSearch(${JSON.stringify(
                                input,
                            )}, ${search}) :: looking at key = ${key}, value = ${
                                input[key]
                            }`,
                        );
                        if (
                            key.toLowerCase().includes(search) ||
                            input[key].toLowerCase().includes(search)
                        ) {
                            // Found a match. Return the object.
                            return input[key];
                        } else {
                            // Not found yet. Keep searching.
                            if (typeof input[key] === "object") {
                                // Input is an object
                                return objDeepSearch(input[key], search);
                            } else if (Array.isArray(input)) {
                                // Input is an array.
                                return arrayDeepSearch(input, search);
                            } else {
                                // Input is anything else.
                                // return input.toString().toLowerCase().includes(search);
                                // If we reach here, we're at the bottom of the nested tree, so return nothing.
                                return undefined;
                            }
                        }
                    }
                });
                // return false;
                // Not found, return nothing.
                return undefined;
            } else if (Array.isArray(input)) {
                // Input is an array.
                return arrayDeepSearch(input, search);
            } else {
                // Input is anything else.
                // return input.toString().toLowerCase().includes(search);
                // If we reach here, we're at the bottom of the nested tree, so return nothing.
                return undefined;
            }
        } else {
            // Value is nowhere to be found in the tree, return nothing.
            return undefined;
        }
    };
    export const arrayDeepSearch = (input, search) => {
        // First check if the value even exists in the tree.
        if (valContains(input, search)) {
            if (typeof input === "object") {
                // Input is an object
                return objDeepSearch(input, search);
            } else if (Array.isArray(input)) {
                // Input is an array.
                input.forEach((value, index) => {
                    if (value) {
                        console.log(
                            `arrayDeepSearch(${JSON.stringify(
                                input,
                            )}, ${search}) :: looking at value = ${value}`,
                        );
                        if (typeof value === "object") {
                            // Input is an object
                            return objDeepSearch(value, search);
                        } else if (Array.isArray(value)) {
                            // Input is an array.
                            return arrayDeepSearch(value, search);
                        } else {
                            // Input is anything else.
                            if (value.toLowerCase().includes(search)) {
                                // Found a match. Return the object.
                                return value;
                            }
                            // return value.toString().toLowerCase().includes(search);
                        }
                    }
                });
            } else {
                // Input is anything else.
                return input.toString().toLowerCase().includes(search);
            }
        } else {
            // Value is nowhere to be found in the tree, return nothing.
            return undefined;
        }
    };
    export const deepSearchObject = (ob, key) => {
        const path = [];
        const keyExists = (obj) => {
            if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
                return undefined;
            } else if (obj.hasOwnProperty(key)) {
                return obj[key];
            } else if (Array.isArray(obj)) {
                let parentKey = path.length ? path.pop() : "";

                for (let i = 0; i < obj.length; i++) {
                    path.push(`${parentKey}[${i}]`);
                    const result = keyExists(obj[i], key);
                    if (result) {
                        return result;
                    }
                    path.pop();
                }
            } else {
                for (const k in obj) {
                    path.push(k);
                    const result = keyExists(obj[k], key);
                    if (result) {
                        return result;
                    }
                    path.pop();
                }
            }
            return undefined;
        };

        // return keyExists(ob);

        return path.join(".");
    };
    // https://stackoverflow.com/questions/15523514/find-by-key-deep-in-a-nested-array
    export function findNestedObj(entireObj, keyToFind, valToFind) {
        let foundObj;
        JSON.stringify(entireObj, (_, nestedValue) => {
            if (valToFind === "" || valToFind === null || valToFind === undefined) {
                if (nestedValue && nestedValue[keyToFind] === valToFind) {
                    foundObj = nestedValue;
                }
            } else {
                if (nestedValue && nestedValue[keyToFind] === valToFind) {
                    foundObj = nestedValue;
                }
            }
            return nestedValue;
        });
        return foundObj;
    }
*/

// var result = deepSearch(myObject, "id", (k, v) => v === 1);
// or;
// var result = deepSearch(myObject, "title", (k, v) => v === "Some Recommends");

export function deepGetKey(object, key) {
	return deepSearch(object, key, (k, v) => k === key, false);
}
export function deepSearch(object, key, predicate, getParent = false) {
	if (!object) return;
	if (object.hasOwnProperty(key) && predicate(key, object[key]) === true) {
		// If the object has a key present, return the parent object containing that key and its value?
		if (getParent) {
			// Return the object containing the key we're looking for.
			return object;
		} else {
			// Return the value contained in the key we're looking for.
			return object[key];
		}
	}
	for (let i = 0; i < Object.keys(object).length; i++) {
		let value = object[Object.keys(object)[i]];
		if (typeof value === "object" && value != null) {
			let o = deepSearch(object[Object.keys(object)[i]], key, predicate, getParent);
			if (o != null) {
				// console.log( "Deepsearch :: o = ", o );
				return o;
			}
		}
	}
	return null;
}

// Here is the demo: http://jsfiddle.net/a21dx6c0/
// In the same way you can find more than one object
export function deepSearchItems(object, key, predicate) {
	let ret = [];
	if (object.hasOwnProperty(key) && predicate(key, object[key]) === true) {
		ret = [...ret, object];
	}
	if (Object.keys(object).length) {
		for (let i = 0; i < Object.keys(object).length; i++) {
			let value = object[Object.keys(object)[i]];
			if (typeof value === "object" && value != null) {
				let o = this.deepSearchItems(object[Object.keys(object)[i]], key, predicate);
				if (o != null && o instanceof Array) {
					ret = [...ret, ...o];
				}
			}
		}
	}
	return ret;
}

// Deep nested recursive search of object array and setting a specific value.
export const findAndSetObject = (obj = {}, key = "", value = "") => {
	const result = [];
	const recursiveSearch = (obj = {}, key, value) => {
		if (!obj || typeof obj !== "object") {
			return;
		}
		// if (obj[key] === value) {
		if (obj.hasOwnProperty(key)) {
			// Object has the key we're looking for.
			// obj[key] = value;
			obj[key] = value;
			return;
		}
		Object.keys(obj).forEach((k) => {
			return recursiveSearch(obj[k], key, value);
		});
	};
	recursiveSearch(obj, key, value);
	// return result;
	return obj;
};

// Source: https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript?page=3&tab=scoredesc#tab-top
export const cloneObj = (obj) => {
	if (Object(obj) !== obj) return obj;
	else if (Array.isArray(obj)) return obj.map(cloneObj);

	return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, cloneObj(v)]));
};

export function deepCopy(src) {
	let target = Array.isArray(src) ? [] : {};
	for (let prop in src) {
		let value = src[prop];
		if (value && typeof value === "object") {
			target[prop] = deepCopy(value);
		} else {
			target[prop] = value;
		}
	}
	return target;
}

export function deepCopy2(obj) {
	return Object.keys(obj).reduce(
		(v, d) =>
			Object.assign(v, {
				[d]: obj[d].constructor === Object ? deepCopy(obj[d]) : obj[d],
			}),
		{},
	);
}

export const deepCopyJSON = (input) => JSON.parse(JSON.stringify(input));
// Deep nested recursive search of object array and setting a specific value.

export const deepFindSet = (input = {}, key = "", value = "") => {
	const result = [];
	let inputobj = { ...input };
	const recursiveSearch = (obj = {}, key, value) => {
		if (!obj || typeof obj !== "object") {
			return obj;
		}
		// if (obj[key] === value) {
		if (obj.hasOwnProperty(key)) {
			// Object has the key we're looking for.
			// obj[key] = value;
			// Object.defineProperty(obj, key, {
			//     value: value,
			//     writable: true,
			//     configurable: true,
			// });
			// console.log("deepFindSet(", obj, key, value, ") :: Found key in obj! :: Before change :: obj =", obj);
			var newObj = { ...obj, [key]: value };
			// console.log("deepFindSet(", obj, key, value, ") :: Found key in obj! :: After change :: obj =", newObj);
			return newObj;
		}
		Object.keys(obj).forEach((k) => {
			return recursiveSearch(obj[k], key, value);
		});
	};
	// recursiveSearch(obj, key, value);
	return recursiveSearch(inputobj, key, value);
	// return result;
	// return inputobj;
};

/*  // Sorting function snippet graveyard. // 
    // Abandon hope all ye who enter here. // 

    // https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/ //
    // Case insensitive value comparison
    export function compareValues(key, order = "asc") {
        return function innerSort(a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
            const comparison = a[key].localeCompare(b[key]);
            return order === "desc" ? comparison * -1 : comparison;
        };
    }

    // https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key //
    // Sort an object's properties by its keys:
    export function objSortByKeys(unordered) {
        const ordered = Object.keys(unordered)
            .sort()
            .reduce((obj, key) => {
                obj[key] = unordered[key];
                return obj;
            }, {});
        return ordered;
    }

    export function sortObject(obj) {
        return Object.keys(obj)
            .sort()
            .reduce(function (result, key) {
                result[key] = obj[key];
                return result;
            }, {});
    }

    const sortDataByKey = (data, key, order) => {
        let sortedData = data.sort(compareValues(key, order));
        console.log(
            "Table :: sortDataByKey(): \n\n\nbefore = ",
            JSON.stringify(data),
            " :: \n\n\nafter = ",
            JSON.stringify(data.sort(compareValues(key, order))),
            " :: \n\n\ntest = ",
            JSON.stringify(data.sort(sortByKey(key, order))),
            " :: \n\n\ntest = ",
            JSON.stringify(sortArrayOfObjects(data, key)),
        );

        const data5 = [...data].sort((a, b) =>
            a[key].toString().localeCompare(b[key].toString(), "en", {
                numeric: true,
            }),
        );
        console.log("");
        // return data.sort( sortByKey( key, order ) ); // sortedData;
        setRenderData(sortedData);
        return sortedData;
        // return sortArrayOfObjects(data, key);
    };

    function compareValues(key, order = 1) {
        return function innerSort(a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // property doesn't exist on either object
                return 0;
            }

            const varA =
                typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
            const varB =
                typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            // console.log(`Table :: compareValues(): comparing [ ${varA}, ${varB} ] :: ${varA > varB} :: comparison = ${comparison}`); // sort by name
            return comparison * order;
        };
    }

    const sortArrayOfObjects = (arr, key) => {
        return arr.sort((a, b) => {
            return a[key] - b[key];
        });
    };

    const sortByKey = (sortKey, order) => (a, b) => {
        // return a[ sortKey ].toLowerCase() > b[ sortKey ].toLowerCase() ? 1 : -1;

        const varA =
            typeof a[sortKey] === "string"
                ? a[sortKey].toLowerCase()
                : a[sortKey];
        const varB =
            typeof b[sortKey] === "string"
                ? b[sortKey].toLowerCase()
                : b[sortKey];
        console.log(
            `Table :: compareValues( ${a}, ${b} ): comparing [ ${varA}, ${varB} ] :: ${
                varA > varB
            }`,
        ); // sort by name
        return varA > varB ? 1 * order : -1 * order;
    };

    const findByKey = (obj, kee) => {
        if (kee in obj) return obj[kee];
        for (n of Object.values(obj)
            .filter(Boolean)
            .filter((v) => typeof v === "object")) {
            let found = findByKey(n, kee);
            if (found) return found;
        }
    };

    const findByProperty = (obj, predicate) => {
        if (predicate(obj)) return obj;
        for (n of Object.values(obj)
            .filter(Boolean)
            .filter((v) => typeof v === "object")) {
            let found = findByProperty(n, predicate);
            if (found) return found;
        }
    };

    let findByValue = (o, val) => {
        if (o === val) return o;
        if (o === NaN || o === Infinity || !o || typeof o !== "object") return;
        if (Object.values(o).includes(val)) return o;
        for (n of Object.values(o)) {
            const found = findByValue(n, val);
            if (found) return n;
        }
    };
    */

/*  // https://dev.to/jonrandy/comment/24ojn // 
    Sort by Truthy/Falsy value
    Avoiding Number is considerably better for performance:
    // for true/false
    const subscribedUsersFirst = users.sort((a, b) => +b.subscribed - +a.subscribed)

    // for any truthy/falsy (avoiding issues with undefined, bigint etc.)
    const subscribedUsersFirst = users.sort((a, b) => +!!b.subscribed - +!!a.subscribed)

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
    // The rest parameter syntax allows a function to accept an indefinite number of arguments as an array, providing a way to represent variadic functions in JavaScript.

    // https://www.tutorialspoint.com/find-specific-key-value-in-array-of-objects-using-javascript
    // const productsObj = {
    //    "LAPTOP": [{
    //       "productId": "123"
    //    }],
    //    "DESKTOP": [{
    //       "productId": "456"
    //    }],
    //    "MOUSE": [{
    //       "productId": "789"
    //    }, {
    //       "productId": "012"
    //    }],
    //    "KEY-BOARD": [{
    //       "productId": "345"
    //    }]
    // };
    // console.log(searchByPair(productsObj, {
    //    'productId': '123'
    // }));
    // 
    // OUTPUT: LAPTOP
    export const searchByPair = (obj = {}, pair = {}) => {
        const toSearch = Object.values(pair)[0];
        let required = undefined;
        Object.keys(obj).forEach((key) => {
            if (obj[key].find((pid) => pid.productId === toSearch)) {
                required = key;
            }
        });
        return required;
    };
*/

export const updateObjArray = (input) => {};

export const varToString = (varObj) => Object.keys(varObj)[0];

export const formatObjArray = (array, split = "_", join = " ") => {
	if (isValidArray(array, true)) {
		return array.map((element, index) => {
			if (isObject(element)) {
				// Element is an object.
				Object.keys(element).forEach((key) => {
					element[key] = element[key].split(split).join(join);
				});
				return element;
			} else if (isArray(element)) {
				// Element is an array.
				return element.map((val) => {
					return val.split(split).join(join);
				});
			} else {
				// Element is a scalar value.
				return element.split(split).join(join);
			}
		});
	}
};

// Will remove all falsy values: undefined, null, 0, false, NaN and "" (empty string)
export const cleanArray = (actual) => {
	var newArray = [];
	for (var i = 0; i < actual.length; i++) {
		if (actual[i]) {
			newArray.push(actual[i]);
		}
	}
	return newArray;
};

// Filters out invalid entries. From antd.
export function filter(items) {
	return items.filter((item) => item);
}

// From Lodash.
export function ownKeys(object, enumerableOnly) {
	var keys = Object.keys(object);
	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(object);
		enumerableOnly &&
			(symbols = symbols.filter(function (sym) {
				return Object.getOwnPropertyDescriptor(object, sym).enumerable;
			}));
		keys.push.apply(keys, symbols);
	}
	return keys;
}
// From Lodash.
export function _objectSpread(target) {
	for (var i = 1; i < arguments.length; i++) {
		let source = null != arguments[i] ? arguments[i] : {};
		i % 2
			? ownKeys(Object(source), !0).forEach(function (key) {
					_defineProperty(target, key, source[key]);
			  })
			: Object.getOwnPropertyDescriptors
			? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
			: ownKeys(Object(source)).forEach(function (key) {
					Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
			  });
	}
	return target;
}
// From Lodash.
export function _defineProperty(obj, key, value) {
	if (key in obj) {
		Object.defineProperty(obj, key, {
			value: value,
			enumerable: true,
			configurable: true,
			writable: true,
		});
	} else {
		obj[key] = value;
	}
	return obj;
}
