import React, {useRef} from 'react';
import {ColorPicker} from './colorpicker';

const rootDivStyle = {
    width: "25%",
    minWidth: "240px",
    boxSizing: "border-box",
    borderRight: "1px solid rgba(0, 0, 0, 0.7)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.7)",
    position: "relative"
};

const inputWidthStyle = {
    width: "80px"
}

const labelWrapperDivStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: "2px",
    height: "38px"
};

const labelStyle = {
    width: "80px",
    paddingLeft: "4px"
};

const removeStyle = {
    position: "absolute",
    top: "0",
    right: "0"
};

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
    onRemove
}) => {
    const colorpickerBlockRef = useRef(null);
    const colorpickerSecondBlockRef = useRef(null);

    const wrappedSetLedCount = e => {
        const val = Number(e.target.value) || 0;
        if (val < 0) {
            setLedCount(0);
            return;
        }
        if (val > 144 * 8) {
            setLedCount(144 * 8);
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
                <input style={inputWidthStyle} type="number" value={ledCount || ""} onChange={wrappedSetLedCount} />
            </div>
            <div style={labelWrapperDivStyle} ref={colorpickerBlockRef}>
                <Label label="color" />
                <ColorPicker rgb={rgb} setRgb={setRgb} blockRef={colorpickerBlockRef} />
            </div>
            <div style={labelWrapperDivStyle}>
                <Label label="brightness" />
                <input style={inputWidthStyle} min="0" max="100" type="number" value={brightness || ""} onChange={wrappedSetBrightness} />
            </div>
            <div style={labelWrapperDivStyle}>
                <Label label="gradient" />
                <input type="checkbox" checked={gradient || ""} onChange={() => setGradient(!gradient)} />
            </div>
            {gradient && <div style={labelWrapperDivStyle} ref={colorpickerSecondBlockRef}>
                <Label label="second" />
                <ColorPicker rgb={secondColor || {r: 0, g: 0, b: 0}} setRgb={setSecondColor} blockRef={colorpickerSecondBlockRef} />
                <button onClick={() => setSecondColor(null)}>clear</button>
            </div>}
            <button onClick={onRemove} style={removeStyle}>remove</button>
        </div>
    );
}