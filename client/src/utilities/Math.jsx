export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
export const iwrap = ( num, min, max ) => {
    var r = max - min;
    return min + ((((num - min) % r) + r) % r);
};
// export const wrap = (num, min, max) => ((((num - min) % (max - min)) + (max - min)) % (max - min)) + min;
export const round = (n, decimals = 0) => Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`);
// Source: https://1loc.dev/number/subtract-arguments/
export const subtract = ( ...args ) => args.reduce( ( a, b ) => a - b );

export function sumIndefinite(...theArgs) {
    let total = 0;
    for (const arg of theArgs) {
        total += arg;
    }
    return total;
}
export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
export function length(numA, numB) {
    return Math.abs(numA - numB);
}

export function distanceTo(pointA, pointB) {
    const xDiff = (pointB.x - pointA.x) ** 2;
    const yDiff = (pointB.y - pointA.y) ** 2;

    return Math.sqrt(xDiff + yDiff);
}

// Source: https://1loc.dev/random/generate-a-random-sign/
export const boolRand = () => ( Math.random() >= 0.5 ? 1 : -1 );

// Source: https://1loc.dev/number/convert-decimal-to-binary-recursively/
export const decToBinary = ( num ) => ( num === 0 ? 0 : ( num % 2 ) + 10 * decToBinary( ~~( num / 2 ) ) );

// https://github.com/phuocng/1loc/blob/master/contents/math/normalize-the-ratio-of-a-number-in-a-range.md
export const normalizeRatio = (value, min, max) => (value - min) / (max - min);

// Random functions
export const iRand = (n = 0) => ~~(Math.random() * n) + 1;
