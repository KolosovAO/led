import React, {useEffect, useRef} from 'react';
import { getRealRGB } from './utils';

const WIDTH = window.innerWidth;
const HEIGHT = 60;
const canvasStyle = {
    width: WIDTH + "px",
    height: HEIGHT + "px",
    marginTop: "12px"
};

const rgbToStyle = ({r, g, b}) => `rgb(${r},${g},${b})`;

export const CanvasRenderer = ({
    blocks
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        const blocksWithLed = blocks.filter(block => block.ledCount);
        const totalLedCount = blocksWithLed.reduce((count, block) => count + block.ledCount, 0);

        if (totalLedCount === 0) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            return;
        }

        let position = 0;
        for (let i=0; i<blocksWithLed.length; i++) {
            const {gradient, secondColor, rgb, brightness, ledCount} = blocksWithLed[i];

            const nextBlockWithLed = blocksWithLed[i + 1] || blocksWithLed[0];

            const c1 = getRealRGB(rgb, brightness);

            const c2 = gradient
                ? secondColor
                    ? getRealRGB(secondColor, brightness)
                    : getRealRGB(nextBlockWithLed.rgb, nextBlockWithLed.brightness)
                : c1;

            const width = Math.floor(ledCount / totalLedCount * WIDTH);

            const c1Style = rgbToStyle(c1);
            const c2Style = rgbToStyle(c2);

            if (c1Style === c2Style) {
                ctx.fillStyle = c1Style;
                ctx.fillRect(position, 0, position + width, HEIGHT);
            } else {
                const gradientStyle = ctx.createLinearGradient(position, 0, position + width, HEIGHT);
                gradientStyle.addColorStop(0, c1Style);
                gradientStyle.addColorStop(1, c2Style);
                ctx.fillStyle = gradientStyle;
                ctx.fillRect(position, 0, position + width, HEIGHT);
            }

            position += width;
        }



    }, [canvasRef, blocks]);

    return <canvas width={WIDTH} height={HEIGHT} style={canvasStyle} ref={canvasRef}></canvas>
};