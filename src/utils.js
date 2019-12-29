const brightnessToCoeff = brightness => (brightness - 50) / 50;

const getRealColor = (color, brightness) => color * (0.5 + 0.5 * brightnessToCoeff(brightness));

const rgbToUint32 = ({r, g, b}) => (r << 24) + (g << 16) + (b << 8);

export const getRealRGB = ({r, g, b}, brightness) => {

    return {
        r: getRealColor(r, brightness),
        g: getRealColor(g, brightness),
        b: getRealColor(b, brightness)
    };
}

export const getColorsArr = blocks => {
    const blocksWithLed = blocks.filter(block => block.ledCount);
    const totalLedCount = blocksWithLed.reduce((count, block) => count + block.ledCount, 0);

    if (totalLedCount === 0) {
        return [];
    }

    const colors = [];

    for (let i=0; i<blocksWithLed.length; i++) {
        const {gradient, secondColor, rgb, brightness, ledCount} = blocksWithLed[i];

        const nextBlockWithLed = blocksWithLed[i + 1] || blocksWithLed[0];

        const c1 = getRealRGB(rgb, brightness);

        const c2 = gradient
            ? secondColor
                ? getRealRGB(secondColor, brightness)
                : getRealRGB(nextBlockWithLed.rgb, nextBlockWithLed.brightness)
            : c1;

        if (c1.r === c2.r && c1.g === c2.g && c1.b === c2.b) {
            colors.push(...Array(ledCount).fill(rgbToUint32(c1)));
        } else {
            const dr = c1.r - c2.r;
            const dg = c1.g - c2.g;
            const db = c1.b - c2.b;

            for (let i=0; i<ledCount; i++) {
                colors.push(rgbToUint32({
                    r: Math.floor(c1.r - i / ledCount  * dr),
                    g: Math.floor(c1.g - i / ledCount  * dg),
                    b: Math.floor(c1.b - i / ledCount  * db)
                }));
            }
        }
    }

    return colors;
}