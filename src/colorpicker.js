import React, {useState, useMemo} from 'react';
import { SketchPicker } from 'react-color';
import { useOuterClick } from './use-outer-click';

const rootDivStyle = {
    position: "relative"
};

const pickerWrapperStyle = {
    position: "absolute",
    left: "18px",
    top: "18px",
    zIndex: 1000
};

export const ColorPicker = ({
    rgb,
    setRgb,
    blockRef
}) => {
    const [isOpened, setIsOpened] = useState(false);

    useOuterClick(() => setIsOpened(false), blockRef);

    const clickableArea = useMemo(() => {
        const style = {
            background: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            cursor: "pointer"
        };


        return <div style={style} onClick={() => setIsOpened(!isOpened)}></div>

    }, [rgb, isOpened]);

    return (
        <div style={rootDivStyle}>
            {clickableArea}
            {isOpened && <div style={pickerWrapperStyle}><SketchPicker color={rgb} onChange={color => setRgb(color.rgb)}/></div>}
        </div>
    );
}