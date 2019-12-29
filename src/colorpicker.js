import React, {useState, useMemo, useRef} from 'react';
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
    setRgb
}) => {
    const lastActionTime = useRef(null);
    const targetRef = useRef(null);
    const [isOpened, setIsOpened] = useState(false);

    useOuterClick(() => {
        setTimeout(() => {
            if (Date.now() - lastActionTime.current > 400) {
                setIsOpened(false);
            }       
        }, 100);
    }, targetRef);

    const clickableArea = useMemo(() => {
        const style = {
            background: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer'
        };


        return <div ref={targetRef} style={style} onClick={() => setIsOpened(!isOpened)}></div>

    }, [rgb, isOpened]);

    const onChange = color => {
        lastActionTime.current = Date.now();
        setRgb(color.rgb);
    };

    return (
        <div style={rootDivStyle}>
            {clickableArea}
            {isOpened && <div style={pickerWrapperStyle}><SketchPicker color={rgb} onChange={onChange}/></div>}
        </div>
    );
}