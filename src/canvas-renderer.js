import React, {useEffect, useRef} from 'react';
import { getRealRGB, rgbToUint32 } from './utils';

const HEIGHT = 60;
const rootStyle = {
    height: HEIGHT + 24 + "px",
    marginTop: "12px",
    width: "100%",
    overflowX: "scroll",
    overflowY: "hidden",
};

const canvasStyle = {
    padding: "0 8px 0 8px"
}

const rgbToStyle = ({r, g, b}) => `rgb(${r},${g},${b})`;

export const CanvasRenderer = ({
    blocks,
    arrayGetterRef
}) => {
    const canvasRef = useRef(null);
    const widthRef = useRef(0);

    const totalLedCount = blocks.reduce((total, block) => total + block.ledCount, 0);

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, widthRef.current, HEIGHT);

        const blocksWithLed = blocks.filter(block => block.ledCount);
        const brightnessArr = [];

        let position = 0;
        for (let i=0; i<blocksWithLed.length; i++) {
            const {gradient, secondColor, rgb, brightness, ledCount} = blocksWithLed[i];

            brightnessArr.push(...Array(ledCount).fill(brightness));

            const blockStyle = rgbToStyle(rgb);

            if (gradient) {
                const nextBlockWithLed = blocksWithLed[i + 1] || blocksWithLed[0];
                const gradientStyle = ctx.createLinearGradient(position, 0, position + ledCount, 0);

                gradientStyle.addColorStop(0, blockStyle);
                if (secondColor) {
                    gradientStyle.addColorStop(0.5, rgbToStyle(secondColor));
                }
                gradientStyle.addColorStop(1, rgbToStyle(nextBlockWithLed.rgb));

                ctx.fillStyle = gradientStyle;
                ctx.fillRect(position, 0, position + ledCount, HEIGHT);
            } else {
                ctx.fillStyle = blockStyle;
                ctx.fillRect(position, 0, position + ledCount, HEIGHT);
            }

            position += ledCount;
        }

        widthRef.current = position;
        arrayGetterRef.current = () => {
            if (position === 0) {
                return [];
            }

            const imageData = ctx.getImageData(0, 0, position, HEIGHT).data;
            const result = [];

            const step = 4 * HEIGHT;

            for (let i=0; i<imageData.length; i += step) {
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];

                const realRGB = getRealRGB({r, g, b}, brightnessArr[result.length]);
                const uint32 = rgbToUint32(realRGB);
                result.push(uint32);
            }

            return result;
        }

    }, [canvasRef, blocks, arrayGetterRef]);

    return (
        <div style={rootStyle}>
            <canvas style={canvasStyle} width={totalLedCount} height={HEIGHT} ref={canvasRef}></canvas>
        </div>
    );
};
