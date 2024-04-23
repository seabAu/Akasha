// Source: ANTD Components utility files.
/** Wrap message open with promise like function */
export function wrapPromiseFn(openFn) {
    let closeFn;
    const closePromise = new Promise((resolve) => {
        closeFn = openFn(() => {
            resolve(true);
        });
    });
    const result = () => {
        closeFn === null || closeFn === void 0 ? void 0 : closeFn();
    };
    result.then = (filled, rejected) => closePromise.then(filled, rejected);
    result.promise = closePromise;
    return result;
}

    export const fetchPromise = (call, fetchOptions = {}) => {
        // console.log("fetchPromise = ", call);
        return new Promise((resolve, reject) => {
            fetch(call, fetchOptions)
                .then((response) => response.json())
                .then((data) => resolve(data))
                .catch((error) => reject(error));
        });
        // return handleBasicFetch(call);
    };

	// Generic fetch function
	export function fetchData(url, parameters, callback) {
		fetch(url, {
			method: "GET", // "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(parameters),
		})
			.then(async (response) => {
				// status 404 or 500 will set ok to false
				if (response.ok) {
					// Success: convert data received & run callback
					let result = await response.json();
					callback(result);
				} else {
					throw new Error(response.status + " Failed Fetch ");
				}
			})
			.catch((e) => console.error("EXCEPTION: ", e));
    }
    