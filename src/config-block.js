import React from 'react';
import {ColorPicker} from './colorpicker';

const rootDivStyle = {
    height: "160px",
    width: "25%",
    boxSizing: "border-box",
    border: "1px solid black"
};

const inputWidthStyle = {
    width: "80px"
}

const labelWrapperDivStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: "2px"
};

const labelStyle = {
    width: "80px"
}

const Label = ({label}) => <div style={labelStyle}>{label}:</div>;


export const ConfigBlock = ({
    rgb,
    setRgb,
    brightness,
    setBrightness,
    ledCount,
    setLedCount,
    gradient,
    setGradient,
    secondColor,
    setSecondColor,
}) => {

    const wrappedSetLedCount = e => {
        const val = Number(e.target.value) || 0;
        if (val < 0) {
            setLedCount(0);
            return;
        }
        setLedCount(val);
    }

    const wrappedSetBrightness = e => {
        const val = Number(e.target.value) || 0;
        if (val < 0) {
            setBrightness(0);
            return;
        }
        if (val > 100) {
            setBrightness(100);
            return;
        }
        setBrightness(val);
    }

    return (
        <div style={rootDivStyle}>
            <div style={labelWrapperDivStyle}>
                <Label label="led count" />
                <input style={inputWidthStyle} type="number" value={ledCount} onChange={wrappedSetLedCount} />
            </div>
            <div style={labelWrapperDivStyle}>
                <Label label="color" />
                <ColorPicker rgb={rgb} setRgb={setRgb} />
            </div>
            <div style={labelWrapperDivStyle}>
                <Label label="brightness" />
                <input style={inputWidthStyle} min="0" max="100" type="number" value={brightness} onChange={wrappedSetBrightness} />
            </div>
            <div style={labelWrapperDivStyle}>
                <Label label="gradient" />
                <input type="checkbox" checked={gradient} onChange={() => setGradient(!gradient)} />
            </div>
            {gradient && <div style={labelWrapperDivStyle}>
                <Label label="second" />
                <ColorPicker rgb={secondColor || {r: 0, g: 0, b: 0}} setRgb={setSecondColor} />
                <button onClick={() => setSecondColor(null)}>clear</button>
            </div>}
        </div>
    );
}