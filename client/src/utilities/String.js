// Utilities centered around string values.
import React from "react";
import * as utils from "./";

export const formatText = (text = "") => {
	// return capitalizeFirstLetter(text.replace("_", " "));
	return toCapitalCase(text.includes("_") ? text.split("_").join(" ") : text);
};

// const capitalizeFirstLetter = (text) => {
// 	return text.charAt(0).toUpperCase() + text.slice(1);
// };

export function toCapitalCase(text) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}
export const kebabCase = (s) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
export const upperCamelCase = (s) => s.replace(/(^|-)([a-z])/g, (x, y, l) => `${l.toUpperCase()}`);

export const PrettyPrintJson = React.memo(({ data }) => (
	<div>
		<pre>{JSON.stringify(data, null, 2)}</pre>
	</div>
));

// Source: https://1loc.dev/random/generate-a-random-string-from-given-characters/
// Example call: generateString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
export const generateString = (length, chars) =>
	Array(length)
		.fill("")
		.map((v) => chars[Math.floor(Math.random() * chars.length)])
		.join("");

export const subStringSearch = (input = "", pattern = "") => {
	// return input.search( pattern );
	return input.includes(pattern);
};

export function replaceMultiple(str, obj) {
	if (str && obj) {
		for (const x in obj) {
			str = str.replace(new RegExp(x, "g"), obj[x]);
		}
		return str;
	}
}

export const getLongest = (input) => {
	let longestStr = "";
	if (utils.val.isValidArray(input, true)) {
		input.forEach((element, index) => {
			if (element) {
				let elementStr = element.toString();
				if (elementStr.length > longestStr.length) longestStr = elementStr;
			}
		});
	} else if (utils.val.isObject(input)) {
		// console.log("GetLongest() :: input = ", input, " :: isObject(input) = ", utils.val.isObject(input), " :: Object.keys(input) = ", Object.keys(input));

		// if (Object.keys(input)) {
		Object.keys(input).forEach((key, index) => {
			// let value = input[ key ];
			// console.log("GetLongest :: key = ", key, " :: key length = ", key.length);
			if (key.length > longestStr.length) longestStr = key;
		});
		// }
	}
	// console.log("GetLongest() :: input = ", input, " :: longestStr = ", longestStr);
	return longestStr.length;
};
