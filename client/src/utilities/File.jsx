export function importFile(filepath) {
    if (filepath) {
        let data;
        console.error(`importFile :: ${filepath} attempting to import`);
        fetch(`${filepath}`)
            .catch((error) => {
                console.error(`importFile :: ${filepath} returned an error: `, error);
                return;
            })
            .then((response) => {
                if (response) {
                    if (!response.ok) {
                        throw new Error("Http error: " + response.status);
                    } else {
                        return response.json();
                    }
                }
            })
            .catch((error) => {
                console.error(`importFile :: ${filepath} returned an error: `, error);
                return;
            })
            .then((result) => {
                data = result;
                console.log(result);
            });
        if (data) {
            return data;
        }
    }
}
