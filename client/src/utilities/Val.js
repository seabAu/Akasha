import React from "react";
import * as utils from "./";

// INPUT VALIDATION

export function valIsValid(value) {
    // console.log( "valIsValid:", value, typeof value );
    if (value) {
        if (value !== undefined) {
            if (value !== null) {
                // if ( value instanceof expectedType )
                return true;
            }
        }
    }
    return false;
}

export function isValid ( value, checkEmpty = false)
{
    if ( value )
    {
    	if (value !== undefined) {
    		if (value !== null) {
    			// if ( value instanceof expectedType )
                if ( checkEmpty )
                {
                    let type = utils.data.getType( value );
                    return type === "string"
                        ? value && value !== "" // ( Math.random() + 1 ).toString( 36 ).slice( 2, 7 ) // .substring(7) // [...Array(30)].map(() => Math.random().toString(36)[2]).join("")
                        : type === "number"
                            ? value !== 0
                            : type === "boolean"
                                ? value
                                : type === "date"
                                    ? value !== 0
                                    : [ "array", "[array]", "[object]", "[string]", "[number]", "[boolean]", "[date]" ].includes( type )
                                        ? value !== []
                                        : type === "object"
                                            ? Object.keys( value ).length > 0 : false;
                }
                return true;
    		}
    	}
    }
    return false;
	// return value !== undefined && value !== null;
}
export const validate = (input) => {
    if (input) {
        // Input is neither null or undefined, proceed to type-specific checks.
        if (Array.isArray(input)) {
            // Input is an array.
            if (input.length > 0) {
                // Array Input has at least 1 entry.
                input.forEach((value, index) => {
                    if (!utils.val.isTruthy(value)) {
						return false;
					}
                });
                return true;
            } else {
                return false;
            }
        } else if (typeof input === "object") {
            Object.entries(input).forEach((prop, index) => {
                let key = prop[0];
                let value = prop[1];

                if (!utils.val.isTruthy(value) || !utils.val.isTruthy(key)) {
                    return false;
                }
            });
            return true;
        } else {
            if (!utils.val.isTruthy(input)) {
                return false;
            } else {
                return true;
            }
        }
    } else {
        return false;
    }
};

export const isValidArray = (input, checklength) => (input && Array.isArray(input) ? (input[0] !== undefined ? (checklength ? input.length > 0 : true) : false) : false);

export const isObjectArray = (input, checklength) => (input && Array.isArray(input) ? (input[0] !== undefined ? (checklength ? input.length > 0 : true) : false) : false);

export const isTruthy = (value) => {
	return value && value !== undefined && value !== null && value !== "";
}
export const isDefined = (value) => {
    return value !== undefined && value !== null;
}
export const isObject = (value) => {
    return value !== null && value !== undefined && typeof value === "object" && !Array.isArray(value);
};
export const isArray = (value) => {
	return value !== null && Array.isArray(value); // && typeof value !== "object";
};
export const isString = (x) => {
    return Object.prototype.toString.call(x) === "[object String]";
};
export const isNumber = (value) => {
	return typeof value === "number";
}
export const isBool = (x) => {
    return x === true || x === false;
};

export const isBlank = (str) => {
	return (!str || /^\s*$/.test(str)) && (this.length === 0 || !this.trim());
}
// vanillaJS
// Checks if object or array
// export const isAO = (val) => val instanceof Array || val instanceof Object;
export const isAO = (val) => {
	return val instanceof Array || val instanceof Object;
}

// https://stackoverflow.com/questions/29312123/how-does-the-double-exclamation-work-in-javascript
// ! is the logical negation or "not" operator. !! is ! twice. It's a way of casting a "truthy" or "falsy" value to true or false, respectively. Given a boolean, ! will negate the value, i.e. !true yields false and vice versa. Given something other than a boolean, the value will first be converted to a boolean and then negated. For example, !undefined will first convert undefined to false and then negate it, yielding true. Applying a second ! operator (!!undefined) yields false, so in effect !!undefined converts undefined to false.
//
// In JavaScript, the values false, null, undefined, 0, -0, NaN, and '' (empty string) are "falsy" values. All other values are "truthy."(1):7.1.2 Here's a truth table of ! and !! applied to various values:
//
//  value     │  !value  │  !!value
// ━━━━━━━━━━━┿━━━━━━━━━━┿━━━━━━━━━━━
//  false     │ ✔ true   │   false
//  true      │   false  │ ✔ true
//  null      │ ✔ true   │   false
//  undefined │ ✔ true   │   false
//  0         │ ✔ true   │   false
//  -0        │ ✔ true   │   false
//  1         │   false  │ ✔ true
//  -5        │   false  │ ✔ true
//  NaN       │ ✔ true   │   false
//  ''        │ ✔ true   │   false
//  'hello'   │   false  │ ✔ true

// A short truthiness reference from: https://stackoverflow.com/questions/784929/what-is-the-not-not-operator-in-javascript?rq=1
// *           !!false === false
// *            !!true === true
// * 
// *               !!0 === false
// * !!parseInt("foo") === false // NaN is falsy
// *               !!1 === true
// *              !!-1 === true  // -1 is truthy
// *           !!(1/0) === true  // Infinity is truthy
// * 
// *              !!"" === false // empty string is falsy
// *           !!"foo" === true  // non-empty string is truthy
// *         !!"false" === true  // ...even if it contains a falsy value
// * 
// *      !!window.foo === false // undefined value is falsy
// *       !!undefined === false // undefined primitive is falsy
// *            !!null === false // null is falsy
// * 
// *              !!{} === true  // an (empty) object is truthy
// *              !![] === true  // an (empty) array is truthy; PHP programmers beware!

export function escapeHtml(unsafe) {
    return String(unsafe).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string //
/**
 *  String#isJSON() -> Boolean
 *
 *  Check if the string is valid JSON by the use of regular expressions.
 *  This security method is called internally.
 *
 *  ##### Examples
 *
 *      "something".isJSON();
 *      // -> false
 *      "\"something\"".isJSON();
 *      // -> true
 *      "{ foo: 42 }".isJSON();
 *      // -> false
 *      "{ \"foo\": 42 }".isJSON();
 *      // -> true
 **/
export function isJSONRegex() {
	var str = this;
	if (str.blank()) return false;
	str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@");
	str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]");
	str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, "");
	return /^[\],:{}\s]*$/.test(str);
}
export function isJSON(str) {
	if (!(str && typeof str === "string")) {
		return false;
	}
	try {
		var json = JSON.parse(str);
		return typeof json === "object";
		// Usage: isJSON({}) will be false, isJSON('{}') will be true.
		// return JSON.parse(str) && !!str;
	} catch (e) {
		return false;
	}
}

export function printDebug(src, vars = []) {
    if (isValidArray(vars)) {
        console.log(
            src,
            " :: vars = ",
            vars,
            vars.map((v, index) => {
                return v;
            }),
            // vars.map((v) => {
            // return [Object.keys(v)[0], v].join(" = ");
            // } ).join( "\n\n" )
        );
    } else {
        console.log("Printdebug :: given nothing to print.");
    }
}

// Source: https://ajax.googleapis.com/ajax/libs/prototype/1.7.1/prototype.js
export function toArray() {
    return this.split("");
}
