// From https://github.com/alexkuz/react-json-tree/blob/master/src/utils/hexToRgb.js
export function hexToRGB(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

// Source: https://github.com/phuocng/1loc/blob/master/contents/misc/convert-rgb-color-to-hex.md
export const rgbToHex = (red, green, blue) =>
    `#${((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1)}`;
// const rgbToHex = (red, green, blue) => `#${[red, green, blue].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
