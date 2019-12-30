const brightnessToCoeff = brightness => (brightness - 50) / 50;

const getRealColor = (color, brightness) => Math.floor(color * (0.5 + 0.5 * brightnessToCoeff(brightness)));

export const rgbToUint32 = ({r, g, b}) => r + (g << 8) + (b << 16);

export const getRealRGB = ({r, g, b}, brightness) => {

    return {
        r: getRealColor(r, brightness),
        g: getRealColor(g, brightness),
        b: getRealColor(b, brightness)
    };
}

export const crc32 = (message) => {
    let i, j, byte, crc, mask;

    i = 0;
    crc = 0xFFFFFFFF;
    while (message[i] !== undefined) {
        byte = message[i].charCodeAt(0);
        crc = crc ^ byte;
        for (j = 7; j >= 0; j--) {
           mask = -(crc & 1);
           crc = (crc >> 1) ^ (0xEDB88320 & mask);
        }
        i += 1;
    }
    return Math.abs(~crc);
}
