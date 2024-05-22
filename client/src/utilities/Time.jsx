const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export function sec2str(t) {
    var d = Math.floor(t / 86400),
        h = ("0" + (Math.floor(t / 3600) % 24)).slice(-2),
        m = ("0" + (Math.floor(t / 60) % 60)).slice(-2),
        s = ("0" + (t % 60)).slice(-2);
    return (
        (d > 0 ? d + "d " : "") +
        (h > 0 ? h + ":" : "") +
        (m > 0 ? m + ":" : "") +
        (t > 60 ? s : s + "s")
    );
}
export function timeElapsed(start, finish) {
    const difference = (finish - start) / 1000;
    return sec2str(difference);
}

export function timeEstimate(start, finish, numCompleted, numTotal) {
    // It took (seconds) time to reach (numTotal).
    const seconds = (finish - start) / 1000;
    // const difference = Math.abs( numTotal - numCompleted );
    const secondsPerCompleted = seconds / numCompleted;
    const secondsToComplete = secondsPerCompleted * numTotal;
    // Divide by( numCompleted ) and multiply by( numTotal ).
    return sec2str(secondsToComplete);
}

export const dateStr2LocaleDateStr = (datestr) => {
    console.log(
        "dateStr2LocaleDateStr :: ",
        datestr,
    );
    // Replace "present" with current date.
    
    if (datestr.toLowerCase() === "present") {
        datestr = // new Date().toLocaleString();
            [months[new Date().getMonth()], new Date().getFullYear()].join(
                " ",
            );
    }
    let date = datestr.split(" ");
    let month = months.indexOf(date[0]);
    let year = date[1];

    // console.log(
    //     "time period = ",
    //     datestr,
    //     date,
    //     month,
    //     year,
    //     new Date(year, month).toLocaleDateString(),
    // );
    return new Date(year, month).toLocaleDateString();
};

export const generateDateOptions = (startYear = 2017, startMonth = 8) => {
    const start = new Date(startYear, startMonth);
    const now = new Date();
    // const now = new Date("2020, 8");

    var numMonths =
        now.getMonth() -
        start.getMonth() +
        (now.getYear() - start.getYear()) * 12;
    // var numMonths = differenceInMonths( now, start );
    // var numYears = Math.floor(numMonths / 12);
    const dates = [];
    for (let y = 0; numMonths >= 0; y++) {
        let year = startYear + y;
        // For each year between now and the start date, ascending.
        for (
            let m = year === startYear ? startMonth : 1;
            m <= 12 && numMonths >= 0;
            m++
        ) {
            // For each month in the year.
            let month = months[m - 1];
            dates.unshift({
                key: `${year}-${m}`,
                value: `${month} ${year}`,
            });
            numMonths--;
        }
    }

    // dates.unshift({
    //     key: "all_dates",
    //     value: "All Dates",
    // });
    // dates.splice(0, 3);
    return dates;
};

export function convertDate(newDate) {
	const months = {
		0: "January",
		1: "February",
		2: "March",
		3: "April",
		4: "May",
		5: "June",
		6: "July",
		7: "August",
		8: "September",
		9: "October",
		10: "November",
		11: "December",
	};
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const d = newDate;
	const year = d.getFullYear();
	const date = d.getDate();
	const monthIndex = d.getMonth();
	const monthName = months[d.getMonth()];
	const dayName = days[d.getDay()]; // Thu
	const formatted = `${dayName}, ${date} ${monthName} ${year}`;
	return formatted.toString();
}


export const convertTimestampToYYYYMMDDDD = ( timestamp ) =>
{
    if ( timestamp )
    {
        let date = new Date(timestamp);
        return date.getFullYear() + "-" + parseInt( date.getMonth() + 1 ) + "-" + date.getDate()
    }
}
export const convertYYYYMMDDDDtoTimestamp = (date) => {
	if (date) {
		return new Date(date.split("-")).getTime();
	}
};

export const formatDate = (date, locale = "en-US") => {
    if (!date) return null;

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString(locale, options);
};

export const formatDateDMY = (date = new Date()) => {
	let year, month, day;

	year = date.getFullYear();
	month = date.getMonth() + 1;
	day = date.getDate();

	month = month.toString().padStart(2, 0);
	day = day.toString().padStart(2, 0);

	return `${day}/${month}/${year}`;
};


export function formatDateDDMMYYYY(date = new Date()) {
	var day, month, year;

	year = date.getFullYear();
	month = date.getMonth() + 1;
	day = date.getDate();

	if (month < 10) {
		month = "0" + month;
	}

	if (day < 10) {
		day = "0" + day;
	}

	return day + "/" + month + "/" + year;
}


export const formatTimestampDDMMYYYY = (inputDate) => {
	// 2023-04-17T16:47:12.141Z
	let date = inputDate;
	let newDate = new Date(date);
	// let converteddate = storeddate.getFullYear() + "-" + parseInt(storeddate.getMonth() + 1) + "-" + storeddate.getDate();
	// let converteddate = newDate.getFullYear() + "-" + parseInt(newDate.getMonth() + 1) + "-" + newDate.getDate();
	// let reverteddate = new Date(converteddate.split("-")).getTime();

	let dd = newDate.getDate();
	let mm = parseInt(newDate.getMonth() + 1);
	let yyyy = newDate.getFullYear();

	// if (dd < 10) dd = `0${dd}`;
	// if (mm < 10) mm = `0${mm}`;

	// let newDate = yyyy + "-" + mm + "-" + dd;
	let formattedDate = `${yyyy}-${mm < 10 ? `0${mm}` : mm}-${dd < 10 ? `0${dd}` : dd}`;

	// console.log(
	// 	"Planner.JS :: formatTimeDate = ",
	// 	inputDate,
	// 	"\n :: date = ",
	// 	date,
	// 	"\n storeddate = ",
	// 	storeddate,
	// 	"\n converteddate = ",
	// 	converteddate,
	// 	"\n reverteddate = ",
	// 	reverteddate,
	// 	"\n newDate = ",
	// 	newDate,
	// );
	return formattedDate;
};
