// A set of utility functions centered around updating and managing the site DOM.
import React from "react";
import * as utils from "./";

// Detect Dark Mode
// Source: https://github.com/phuocng/1loc/blob/master/contents/misc/detect-dark-mode.md
export const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;


export function setElementValueById ( id, value )
{
    if (id && value) {
        // Valid inputs, proceed.
        const element = document.getElementById(id);
        if (element) {
            element.value = value.latitude;
            return element; // Return element if successful.
        } else {
            // console.error("setElementValueById :: ERR: Invalid ID: ", id);
        }
    } else {
        // console.error("setElementValueById :: ERR: Invalid Inputs: ", value, ", ", id);
    }
}


// Turns an object into an unordered list, except as json-friendly text instead of HTML elements.
export const obj2ListText = (input) => {
    // console.log( "obj2ListText :: input = ", input );
    let result = "";
    if (typeof input === "object") {
        Object.entries(input).forEach((prop, index) => {
            let objKey = prop[0];
            let objValue = prop[1];
            if (typeof objValue === "object" && objValue !== null) {
                // Nested object
                result += `<li className="obj-list-item">${objKey}:` + obj2ListText(objValue) + `</li>`;
            } else {
                // Not a nested object.
                result += `<li className="obj-list-item">${objKey}: ${utils.ao.cleanInvalid(objValue, "-")}</li>`;
            }
        })
        
    }

    return `<ul>` + result + `</ul>`;
}


// Turns an object array into an unordered list, with recursion.
export const objArray2List = (input) => {
    // console.log("objArray2List :: input = ", input);
    if (utils.val.isArray(input)) {
        return (
            <ul className="obj-list">
                {input.map((object, arrayIndex) => {
                    return (
                        //<li id={`obj-list-${arrayIndex}`} className={`li-${arrayIndex}`}>
                        Object.entries(object).map((prop, objIndex) => {
                            let objKey = prop[0];
                            let objValue = prop[1];
                            if (
                                typeof objValue === "object" &&
                                objValue !== null
                            ) {
                                // Nested object
                                return (
                                    <li className="obj-list-item">
                                        <div className="obj-list-key">
                                            {objKey}
                                        </div>
                                        :{" "}
                                        <div className="obj-list-value">
                                            {obj2List(objValue)}
                                        </div>
                                    </li>
                                );
                            } else {
                                // Not a nested object.

                                // Sanitize the value if it's null or undefined.
                                return (
                                    <li className="obj-list-item">
                                        <div className="obj-list-key">
                                            {objKey}
                                        </div>
                                        :{" "}
                                        <div className="obj-list-value">
                                            {utils.ao.cleanInvalid(objValue, "-")}
                                        </div>
                                    </li>
                                );
                            }
                        })
                        //</li>
                    );
                })}
            </ul>
        );
    } else if (typeof input === "object") {
        return obj2List(input);
    }
};

export const value2List = ( input ) =>
{
    return ( !( utils.val.isArray( input ) ) && !( typeof input === "object" ) ) ? ( <div className="obj-list-value">
        { utils.ao.cleanInvalid( input, "-" ) }
    </div> ) : '';
}

// Turns an object into an unordered list, with recursion.
export const array2List = (input) => {
    // console.log("array2List :: input = ", input);
    if (utils.val.isArray(input)) {
        return array2List(input);
    } else if (typeof input === "object") {
        return obj2List(input);
    } else
    {
        
    }
};

// Turns an object into an unordered list, with recursion.
export const obj2List = (input) => {
    // console.log("obj2List :: input = ", input);
    if (utils.val.isArray(input)) {
        return objArray2List(input);
    } else if (typeof input === "object") {
        return (
            <ul className="obj-list">
                {Object.entries(input).map((objProperty, index) => {
                    let objKey = objProperty[0];
                    let objValue = objProperty[1];
                    if (typeof objValue === "object" && objValue !== null) {
                        // Nested object
                        return (
                            <li className="obj-list-item">
                                <div className="obj-list-key">{objKey}</div>:{" "}
                                <div className="obj-list-value">
                                    {obj2List(objValue)}
                                </div>
                            </li>
                        );
                    } else {
                        // Not a nested object.
                        // Sanitize the value if it's null or undefined.
                        return (
                            <li className="obj-list-item">
                                <div className="obj-list-key">{objKey}</div>:{" "}
                                <div className="obj-list-value">{utils.ao.cleanInvalid(objValue, "-")}</div>
                            </li>
                        );
                    }
                })}
            </ul>
        );
    }
};



///////////////////////////////////////////////////////






// Turns an object into an unordered list, with recursion.
export const objArrayToList = (input) => {
    // console.log("arrayToList :: input = ", input);
    // if (utils.val.isArray(input)) {
    //     return arrayToList(input);
    // } else if (typeof input === "object") {
    //     return objToList(input);
    // } else
    // {
    //     return valueToList( input );
    // }
    return utils.val.isObject(input)
        ? objToList(input)
        : utils.val.isArray(input)
        ? arrayToList(input)
        : valToList(input);
};

// Turns an object array into an unordered list, with recursion.
export const arrayToList = (input) => {
    // console.log("objArrayToList :: input = ", input);
    if (utils.val.isArray(input) && utils.val.isValidArray(input)) {
        return (
            <ul className="obj-list">
                { input.map( ( element, arrayIndex ) =>
                {
                    // Run through each element in the array.
                    // For each, check if it's an array, object, or scalar, and build nested elements accordingly. 
                    return (
                        <li className="obj-list-item">
                            <div className="obj-list-key">
                                `${arrayIndex}: `
                            </div>
                            <div className="obj-list-value">
                                { utils.val.isObject(element) ? ((objToList(element))) : (( utils.val.isArray( element ) ) ? (arrayToList( element )) : (valToList( element )))
                                    // if ( utils.val.isObject(element) )
                                    // {
                                    //     // Array element is an object.
                                    //     return (objToList(element));
                                    // } else if ( utils.val.isArray( element ) )
                                    // {
                                    //     // Array element is another array.
                                    //     return arrayToList( element );
                                    // } else
                                    // {
                                    //     // Array element is just a scalar value.
                                    //     return valToList( element );
                                    // }
                                }
                            </div>
                        </li>
                    );
                }
                )
                }
            </ul>
        );
    } else if (typeof input === "object") {
        return objToList(input);
    }
};

// Turns an object into an unordered list, with recursion.
export const objToList = (input) => {
    // console.log("objToList :: input = ", input);
        if (utils.val.isObject(input)) {
            // Input is an object.
            return (
            <ul className="obj-list">
            {
                //<li id={`obj-list-${arrayIndex}`} className={`li-${arrayIndex}`}>
                Object.entries(input).map((prop, objIndex) => {
                    let objKey = prop[0];
                    let objValue = prop[1];
                    if (typeof objValue === "object" && objValue !== null) {
                        // Nested object
                        return (
                            <li className="obj-list-item">
                                <div className="obj-list-key">
                                    `${objKey}: `
                                </div>
                                <div className="obj-list-value">
                                    {objToList(objValue)}
                                </div>
                            </li>
                        );
                    } else if (utils.val.isArray(objValue)) {
                        // Nested array
                        return (
                            <li className="obj-list-item">
                                <div className="obj-list-key">
                                    `${objKey}: `
                                </div>
                                <div className="obj-list-value">
                                    {arrayToList(objValue)}
                                </div>
                            </li>
                        );
                    } else {
                        // Just a scalar.
                        // Sanitize the value if it's null or undefined.
                        return (
                            <li className="obj-list-item">
                                <div className="obj-list-key">
                                    `${objKey}: `
                                </div>
                                <div className="obj-list-value">
                                    {valueToList(objValue)}
                                </div>
                            </li>
                        );
                    }
                })
                //</li>
                }</ul>
            );
        } else if (utils.val.isArray(input)) {
            // Input is an array.
            return arrayToList( input );
        } else {
            // Input is just a scalar value.
            return valToList(input);
        }
};

// export const valueToList = ( input ) => ( !( utils.val.isArray( input ) ) && !( typeof input === "object" ) ) ? ( utils.ao.cleanInvalid( input, "-" )) : '';
export const valueToList = (input) =>
    !utils.val.isArray(input) && !(typeof input === "object")
        ? utils.ao.cleanInvalid(input, "-")
        : "";

export const valToList = (input) =>
    utils.val.isArray(input) ? (
        // Array
        <div className="obj-list-value">{arrayToList(input)}</div>
    ) : (
        (typeof input === "object") ? (
            // Object
            (<div className="obj-list-value">{objToList(input)}</div>)
        ) : (
            // Scalar
            <div className="obj-list-value">{utils.ao.cleanInvalid(input, "-")}</div>
        )
    );

export const hasClass = ( e, classes = "" ) =>
{ 
    if ( e.target )
    { 
        // if ( utils.ao.has( target, 'classList' ) )
        // {
            let targetClasses = e.target.classList;
    		if (targetClasses.contains(classes)) {
    			return true;
    		}
        // }
    }
    return false;
}


/*
    {
        // JSON.stringify(selectedAreas, null, 2)
        // JSON.stringify(
        //     // util.dom.objToListText(
        //         util.geo.geoObj2geoArray( selectedAreas[ 0 ] )
        //     // ),
        //     null,
        //     2,
        // )
        // util.dom.objArrayToList(
        // objArrayToList(
        dataToList(
            renderData,
            `data-list`,
            0,
            showExpandable
            // util.geo.geoObj2geoArray(
            // util.geo.geoObjArray2geoArrayArray(
            //     //     selectedAreas[0],
            //     selectedAreas,
            // ),
            // selectedAreas.map((area)=>geoObj2geoArray(area))
        )
    }
    
    const elementToListElement = (
            dataLabel,
            dataValue,
            classPrefix,
            parentIndex,
            expandable = false,
            checked = false
        ) => {
            if (expandable) {
                return (
                    <li className={`${classPrefix}-item`}>
                        <label
                            for={`tab-${parentIndex}`}
                            name="tab"
                            tabindex="-1"
                            role="tab"
                            className={`${classPrefix}-key`}
                        >
                            {dataLabel}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={`${checked ? 'checked' : ''}`}
                            className="tab"
                            id={`tab-${parentIndex}`}
                            tabindex={ `${ parentIndex }` }
                            // onChange={}
                        />
                        <span className="open-close-icon">
                            <i className="fas fa-plus"></i>
                            <i className="fas fa-minus"></i>
                        </span>
                        <div className={`${classPrefix}-content`}>{dataValue}</div>
                    </li>
                );
            } else {
                return (
                    <li className={`${classPrefix}-item`}>
                        <div className={`${classPrefix}-key`}>{dataLabel}: </div>
                        <div className={`${classPrefix}-value`}>{dataValue}</div>
                    </li>
                );
            }
        };
    // Turns an object array into an unordered list, with recursion.
    const objArrayToList = (input, classPrefix, parentIndex, expandable) => {
        // console.log("objArrayToList :: input = ", input);
        if (util.val.isArray(input)) {
            // Top-level input is an array.
            return (
                <ul
                    className={`${classPrefix}-array ${
                        expandable ? `${classPrefix}-expandable` : ''
                    }`}
                >
                    {input.map((arrElement, arrayIndex) => {
                        // Map for each item in the array.
                        return elementToListElement(
                            arrayIndex,
                            util.val.isArray(arrElement)
                                ? // Object value is a nested array.
                                  objArrayToList(
                                      arrElement,
                                      classPrefix,
                                      `${parentIndex}-${arrayIndex}`,
                                      expandable
                                  )
                                : util.val.isObject(arrElement)
                                ? // Object value is a nested object
                                  objToList(
                                      arrElement,
                                      classPrefix,
                                      `${parentIndex}-${arrayIndex}`,
                                      expandable
                                  )
                                : // Object value is not a nested object; is a scalar.
                                  util.ao.cleanInvalid(arrElement, '-'),
                            classPrefix,
                            `${parentIndex}-${arrayIndex}`,
                            expandable,
                            true
                        );
                    })}
                </ul>
            );
        } else if (util.val.isObject(input)) {
            // Top-level input is an object.
            return objToList(input, classPrefix, parentIndex, expandable);
        }
    };

    // Turns an object into an unordered list, with recursion.
    const objToList = (input, classPrefix, parentIndex, expandable) => {
        // console.log("objToList :: input = ", input);
        if (util.val.isArray(input)) {
            // Input is an array.
            return objArrayToList(input, classPrefix, parentIndex, expandable);
        } else if (util.val.isObject(input)) {
            // Input is an object.
            return (
                <ul
                    className={`${classPrefix}-obj ${
                        expandable ? `${classPrefix}-expandable` : ''
                    }`}
                >
                    { Object.entries( input ).map( ( prop, objIndex ) =>
                    {
                        // Iterate for each entry in the object.
                        let objKey = prop[0];
                        let objValue = prop[1];
                        return elementToListElement(
                            objKey,
                            util.val.isArray(objValue)
                                ? // Object value is a nested array.
                                  objArrayToList(
                                      objValue,
                                      classPrefix,
                                      `${parentIndex}-${objIndex}`,
                                      expandable
                                  )
                                : util.val.isObject(objValue)
                                ? // Object value is a nested object
                                  objToList(
                                      objValue,
                                      classPrefix,
                                      `${parentIndex}-${objIndex}`,
                                      expandable
                                  )
                                : // Object value is not a nested object; is a scalar.
                                  util.ao.cleanInvalid(objValue, '-'),
                            classPrefix,
                            `${parentIndex}-${objIndex}`,
                            expandable,
                            false
                        );
                    })}
                </ul>
            );
        }
    };

    const getExpandableDropdown = (
        label,
        content,
        checked,
        classPrefix,
        id,
        index = Math.round(Math.random() * 1000)
    ) => {
        return `
                <label for='tab-${index}' name='tab' tabindex='-1' role='tab' class="${classPrefix}-key">
                  ${label}
                  </label>
                  <input type="checkbox" ${
                      checked ? 'checked' : ''
                  } class="tab" id="tab-${index}" tabindex="0" />
                  <span class="open-close-icon">
                      <i class="fas fa-plus"></i>
                      <i class="fas fa-minus"></i>
                  </span>
                        <div class="${classPrefix}-content">
                            ${content}
                        </div>
               `;
    };

    const arrayToListText = (input, classPrefix, expandable, parentIndex) => {
        // console.log("expandable = ", expandable);
        if (util.val.isArray(input)) {
            // Input is an array.
            // return `<ul class="${classPrefix}-array ${classPrefix}-expandable">
            return `<ul class="${classPrefix}-obj ${
                expandable ? `${classPrefix}-expandable` : ''
            }">
            ${input
                .map((value, index) => {
                    if (typeof value === 'object') {
                        // Nested object
                        let nestedValue = objToListText(
                            value,
                            classPrefix,
                            expandable,
                            index
                        );
                        return `
                        <li class="${classPrefix}-item">
                            ${
                                expandable
                                    ? getExpandableDropdown(
                                          '',
                                          nestedValue,
                                          true,
                                          classPrefix,
                                          `${parentIndex}-${index}`,
                                          `${parentIndex}-${index}`
                                      )
                                    : nestedValue
                            }
                        </li>
                        `;
                    } else if (util.val.isArray(input)) {
                        // Nested array.
                        let nestedValue = arrayToListText(
                            value,
                            classPrefix,
                            expandable,
                            index
                        );
                        return `
                        <li class="${classPrefix}-item">
                            <div class="${classPrefix}-content">
                                ${
                                    // arrayToListText(value, classPrefix, expandable, index)
                                    getExpandableDropdown(
                                        '',
                                        nestedValue,
                                        false,
                                        classPrefix,
                                        `${parentIndex}-${index}`,
                                        `${parentIndex}-${index}`
                                    )
                                }
                            </div>
                        </li>
                        `;
                    } else {
                        // Not a nested item.
                        return `
                        <li class="${classPrefix}-item">
                            <div class="${classPrefix}-value">
                                ${util.ao.cleanInvalid(value, '-')}
                            </div>
                        </li>
                        `;
                    }
                })
                .join('')}</ul>`;
        } else if (typeof input === 'object') {
            // Input is an object.
            // result =
            return objToListText(input);
        } else {
            // Input is anything else.
            return `<li class="${classPrefix}-item"><div class="${classPrefix}-value">${util.ao.cleanInvalid(
                input,
                '-'
            )}</div></li>`;
        }
    };

    const objToListText = (input, classPrefix, expandable, parentIndex) => {
        // console.log("expandable = ", expandable);
        if (util.val.isArray(input)) {
            // Input is an array.
            return arrayToListText(input, classPrefix, expandable, parentIndex);
        } else if (typeof input === 'object') {
            // Input is an object.
            // result =
            // let class = `${expandable ? `${classPrefix}-expandable` : ''}`;
            return `<ul class="${classPrefix}-obj ${
                expandable ? `${classPrefix}-expandable` : ''
            }">${Object.entries(input)
                .map((prop, index) => {
                    let objKey = prop[0];
                    let objValue = prop[1];
                    if (typeof objValue === 'object' && objValue !== null) {
                        // Nested object
                        let nestedValue = objToListText(
                            objValue,
                            classPrefix,
                            expandable,
                            index
                        );
                        return `
                        <li class="${classPrefix}-item">
                            ${
                                expandable
                                    ? getExpandableDropdown(
                                          objKey,
                                          nestedValue,
                                          false,
                                          classPrefix,
                                          `${parentIndex}-${index}-${objKey}`,
                                          `${parentIndex}-${index}-${objKey}`
                                      )
                                    : nestedValue
                            }
                        </li>
                        `;
                    } else if (util.val.isArray(input)) {
                        // Nested array.
                        let nestedValue = arrayToListText(
                            objValue,
                            classPrefix,
                            expandable,
                            index
                        );
                        return `
                        <li class="${classPrefix}-item">
                            ${
                                expandable
                                    ? getExpandableDropdown(
                                          objKey,
                                          nestedValue,
                                          false,
                                          classPrefix,
                                          `${parentIndex}-${index}-${objKey}`,
                                          `${parentIndex}-${index}-${objKey}`
                                      )
                                    : nestedValue
                            }
                        </li>
                        `;
                    } else {
                        // Not a nested object.
                        return `
                            <li class="${classPrefix}-item">
                                <div class="${classPrefix}-key">
                                    ${objKey}: 
                                </div>
                                <div class="${classPrefix}-value">
                                    ${util.ao.cleanInvalid(objValue, '-')}
                                </div> 
                            </li>
                        `;
                    }
                })
                .join('')}</ul>`;
        } else {
            // Input is anything else.
            return `<li className="${classPrefix}-item"><div class="${classPrefix}-value">${util.ao.cleanInvalid(
                input,
                '-'
            )}</div> </li>`;
        }
    };

    const objArrayToListText = (
        input,
        classPrefix,
        expandable,
        parentIndex = Math.round(Math.random() * 1000)
    ) => {
        // console.log( "objToListText :: input = ", input );
        const resultElement = document.createElement('div');
        let result;
        if (util.val.isArray(input)) {
            // Input is an array.
            // return objArrayToListText(input, classPrefix, parentIndex);
            return arrayToListText(input, classPrefix, expandable, parentIndex);
        } else if (typeof input === 'object') {
            // Input is an object.
            // result =
            // return objToListText(input);
            return objToListText(input, classPrefix, expandable, parentIndex);
        } else {
            // Input is anything else.
            return `<li class="${classPrefix}-item"><div class="${classPrefix}-value">${util.ao.cleanInvalid(
                input,
                '-'
            )}</div> </li>`;
        }
    };

    const getExpandable = (
        dataLabel,
        dataValue,
        checked,
        classPrefix,
        id,
        index = Math.round(Math.random() * 1000)
    ) => {
        return (
            <li className={`${classPrefix}-item`}>
                <label
                    for="tab-${index}"
                    name="tab"
                    tabindex="-1"
                    role="tab"
                    class="${classPrefix}-key"
                >
                    ${dataLabel}
                </label>
                <input
                    type="checkbox"
                    checked={`${checked ? 'checked' : ''}`}
                    class="tab"
                    id={`tab-${index}`}
                    tabindex="0"
                />
                <span class="open-close-icon">
                    <i class="fas fa-plus"></i>
                    <i class="fas fa-minus"></i>
                </span>
                <div class={`${classPrefix}-content`}>${dataValue}</div>
            </li>
        );
    };

    // Turns an object array into an unordered list, with recursion.
    const objArrayToList2 = (input, classPrefix, parentIndex, expandable) => {
        // console.log("objArrayToList :: input = ", input);
        if (util.val.isArray(input)) {
            // Top-level input is an array.
            return (
                <ul
                    className={`${classPrefix}-array ${
                        expandable ? `${classPrefix}-expandable` : ''
                    }`}
                >
                    {input.map((arrElement, arrayIndex) => {
                        // Map for each item in the array.

                        if (util.val.isArray(arrElement)) {
                            // Array element is a nested array.
                            return (
                                <li className={`${classPrefix}-item`}>
                                    <div className={`${classPrefix}-key`}>
                                        {arrayIndex}:{' '}
                                    </div>
                                    <div className={`${classPrefix}-value`}>
                                        {objArrayToList(
                                            arrElement,
                                            classPrefix,
                                            `${parentIndex}-${arrayIndex}`,
                                            expandable
                                        )}
                                    </div>
                                </li>
                            );
                        } else if (util.val.isObject(arrElement)) {
                            // Array element is a nested object.
                            return (
                                <li className={`${classPrefix}-item`}>
                                    <div className={`${classPrefix}-key`}>
                                        {arrayIndex}:{' '}
                                    </div>
                                    <div className={`${classPrefix}-value`}>
                                        {objToList(
                                            arrElement,
                                            classPrefix,
                                            `${parentIndex}-${arrayIndex}`,
                                            expandable
                                        )}
                                    </div>
                                </li>
                            );
                        } else {
                            // Array element is a scalar.
                            return (
                                <li className={`${classPrefix}-item`}>
                                    <div className={`${classPrefix}-key`}>
                                        {arrayIndex}:{' '}
                                    </div>
                                    <div className={`${classPrefix}-value`}>
                                        {util.ao.cleanInvalid(arrElement, '-')}
                                    </div>
                                </li>
                            );
                        }
                    })}
                </ul>
            );
        } else if (util.val.isObject(input)) {
            // Top-level input is an object.
            return objToList(input, classPrefix, parentIndex, expandable);
        }
    };

    // Turns an object into an unordered list, with recursion.
    const objToList2 = (input, classPrefix, expandable, parentIndex) => {
        // console.log("objToList :: input = ", input);
        if (util.val.isArray(input)) {
            // Input is an array.
            return objArrayToList(input, classPrefix, parentIndex, expandable);
        } else if (util.val.isObject(input)) {
            // Input is an object.
            return (
                <ul
                    className={`${classPrefix}-obj ${
                        expandable ? `${classPrefix}-expandable` : ''
                    }`}
                >
                    {Object.entries(input).map((prop, objIndex) => {
                        let objKey = prop[0];
                        let objValue = prop[1];
                        return util.val.isArray(objValue)
                            ? // Object value is a nested array.
                              elementToListElement(
                                  objKey,
                                  objArrayToList(
                                      objValue,
                                      classPrefix,
                                      `${parentIndex}-${objIndex}`,
                                      expandable
                                  ),
                                  classPrefix,
                                  `${parentIndex}-${objIndex}`,
                                  expandable,
                                  false
                              )
                            : util.val.isObject(objValue)
                            ? // Object value is a nested object
                              elementToListElement(
                                  objKey,
                                  objToList(
                                      objValue,
                                      classPrefix,
                                      `${parentIndex}-${objIndex}`,
                                      expandable
                                  ),
                                  classPrefix,
                                  `${parentIndex}-${objIndex}`,
                                  expandable,
                                  false
                              )
                            : // Object value is not a nested object; is a scalar.
                              elementToListElement(
                                  objKey,
                                  util.ao.cleanInvalid(objValue, '-')
                              );
                        // if (util.val.isObject(objValue)) {
                        //     // Object value is a nested object
                        //     return (
                        //         <li className={`${classPrefix}-item`}>
                        //             <div className={`${classPrefix}-key`}>
                        //                 {objKey}:{' '}
                        //             </div>
                        //             <div className={`${classPrefix}-value`}>
                        //                 {objToList(
                        //                     objValue,
                        //                     classPrefix,
                        //                     `${parentIndex}-${objIndex}`,
                        //                     expandable
                        //                 )}
                        //             </div>
                        //         </li>
                        //     );
                        // } else if (util.val.isArray(objValue)) {
                        //     // Object value is a nested array.
                        //     return (
                        //         <li className={`${classPrefix}-item`}>
                        //             <div className={`${classPrefix}-key`}>
                        //                 {objKey}:{' '}
                        //             </div>
                        //             <div className={`${classPrefix}-value`}>
                        //                 {objArrayToList(
                        //                     objValue,
                        //                     classPrefix,
                        //                     `${parentIndex}-${objIndex}`,
                        //                     expandable
                        //                 )}
                        //             </div>
                        //         </li>
                        //     );
                        // } else {
                        //     // Object value is not a nested object; is a scalar.
                        //     return (
                        //         <li className={`${classPrefix}-item`}>
                        //             <div className={`${classPrefix}-key`}>
                        //                 {objKey}:{' '}
                        //             </div>
                        //             <div className={`${classPrefix}-value`}>
                        //                 {util.ao.cleanInvalid(
                        //                     objValue,
                        //                     '-'
                        //                 )}
                        //             </div>
                        //         </li>
                        //     );
                        // }
                    })}
                </ul>
            );
            return (
                <ul className="obj-list">
                    {Object.entries(input).map((objProperty, index) => {
                        let objKey = objProperty[0];
                        let objValue = objProperty[1];
                        if (typeof objValue === 'object' && objValue !== null) {
                            // Nested object
                            return (
                                <li className="obj-list-item">
                                    <div className="obj-list-key">{objKey}</div>
                                    :{' '}
                                    <div className="obj-list-value">
                                        {objToList(objValue, classPrefix, expandable, parentIndex)}
                                    </div>
                                </li>
                            );
                        } else {
                            // Not a nested object.
                            // Sanitize the value if it's null or undefined.
                            return (
                                <li className="obj-list-item">
                                    <div className="obj-list-key">{objKey}</div>
                                    :{' '}
                                    <div className="obj-list-value">
                                        {util.ao.cleanInvalid(objValue, '-')}
                                    </div>
                                </li>
                            );
                        }
                    })}
                </ul>
            );
        }
    };

*/