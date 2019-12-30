import React, { useReducer, useRef } from 'react';
import { ConfigBlock } from './config-block';
import { CanvasRenderer } from './canvas-renderer';
import { crc32 } from './utils';

let seed = Date.now();
const uid = () => "u" + seed++;

const createConfig = () => ({
    ledCount: 0,
    rgb: {
        r: 0,
        g: 0,
        b: 0
    },
    brightness: 50,
    gradient: true,
    secondColor: null,
    key: uid()
});

const initialState = {
    0: createConfig(),
    length: 1
};

const reducer = (state, action) => {
    const idx = action.idx;
    switch (action.type) {
        case "ADD":
            return {
                ...state,
                [state.length]: createConfig(),
                length: state.length + 1
            };
        case "REMOVE":
            const newState = {length: state.length - 1};
            for (const key in state) {
                const num = Number(key);
                if (num === idx) {
                    continue;
                }
                if (num > idx) {
                    newState[num - 1] = state[key]; 
                } else {
                    newState[num] = state[key];
                }
            }

            return newState;
        case "SET_LED_COUNT":
            return {
                ...state,
                [idx]: {
                    ...state[idx],
                    ledCount: action.payload
                }
            }
        case "SET_RGB":
            return {
                ...state,
                [idx]: {
                    ...state[idx],
                    rgb: action.payload
                }
            }
        case "SET_BRIGHTNESS":
            return {
                ...state,
                [idx]: {
                    ...state[idx],
                    brightness: action.payload
                }
            }
        case "SET_SECOND_COLOR":
            return {
                ...state,
                [idx]: {
                    ...state[idx],
                    secondColor: action.payload
                }
            }
        case "SET_GRADIENT":
            return {
                ...state,
                [idx]: {
                    ...state[idx],
                    gradient: action.payload
                }
            }
        default:
            return state;
    }
}

const rootStyle = {
    display: "flex",
    flexWrap: "wrap"
};

const addStyle = {
    width: "25%",
    height: "160px"
};

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const arrayGetterRef = useRef(null);

    const blocks = Array.from(state);

    const configBlocks = blocks.map((block, idx) =>
        <ConfigBlock
            key={block.key}
            rgb={block.rgb}
            setRgb={(rgb) => dispatch({type: "SET_RGB", payload: rgb, idx})}
            brightness={block.brightness}
            setBrightness={(brightness) => dispatch({type: "SET_BRIGHTNESS", payload: brightness, idx})}
            ledCount={block.ledCount}
            setLedCount={(ledCount) => dispatch({type: "SET_LED_COUNT", payload: ledCount, idx})}
            gradient={block.gradient}
            setGradient={(gradient) => dispatch({type: "SET_GRADIENT", payload: gradient, idx})}
            secondColor={block.secondColor}
            setSecondColor={(secondColor) => dispatch({type: "SET_SECOND_COLOR", payload: secondColor, idx})}
            onRemove={() => dispatch({type: "REMOVE", idx})}
        />
    );

    const send = () => {
        const colors = arrayGetterRef.current().join(" ");
        const result = crc32(colors) + " " + colors;
        console.log(result);
    }
    
    return (
        <div>
            <div style={rootStyle}>
                {configBlocks}
                <button style={addStyle} onClick={() => dispatch({type: "ADD"})}>ADD</button>
            </div>
            <CanvasRenderer blocks={blocks} arrayGetterRef={arrayGetterRef} />
            <button onClick={send}>SEND</button>
        </div>
    );
}

export default App;
