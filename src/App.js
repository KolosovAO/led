import React, { useReducer, useRef, useState } from 'react';
import { ConfigBlock } from './config-block';
import { CanvasRenderer } from './canvas-renderer';
import { crc32, loadFromLocalStorage, withLocalStorageSave, saveStateAs, loadState, copyToClipboard } from './utils';
import "./App.css";

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

const initialState = loadFromLocalStorage() || {
    0: createConfig(),
    length: 1
};

const reducer = (state, action) => {
    const idx = action.idx;
    switch (action.type) {
        case "LOAD":
            return action.payload;
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

const reducerWithLocalStorageSave = withLocalStorageSave(reducer);

const rootStyle = {
    display: "flex",
    flexWrap: "wrap"
};

const addStyle = {
    width: "25%",
    minWidth: "240px",
    height: "201px"
};

const buttonBlockStyle = {
    height: "48px",
    width: "100%",
    display: "flex"
};

const textareaStyle = {
    flex: 1,
    boxSizing: "border-box"
};

const emptyStyle = {
    flex: 1,
    background: "rgba(0, 0, 0, 0.7)"
};

const rootAppStyle = {
    display: "flex",
    flexDirection: "column",
    height: window.innerHeight + "px"
};

function App() {
    const [state, dispatch] = useReducer(reducerWithLocalStorageSave, initialState);
    const arrayGetterRef = useRef(null);
    const [appResult, setAppResult] = useState("");

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

    const getResult = () => {
        const colors = arrayGetterRef.current().map(v => String(v).padStart(10, "0")).join(" ");
        const result = String(crc32(colors)).padStart(10, "0") + " " + colors;
        return result;
    }

    const send = () => {
        const result = getResult();
        setAppResult(result);

        if (window.SEND_RESULT) {
            window.SEND_RESULT(result);
        }
    };

    const load = () => {
        loadState()
            .then(state => dispatch({type: "LOAD", payload: state}))
            .catch(() => {});
    };

    const save = () => saveStateAs(state);

    const copy = () => {
        const result = getResult();
        copyToClipboard(result);
    }
    
    return (
        <div style={rootAppStyle}>
            <CanvasRenderer blocks={blocks} arrayGetterRef={arrayGetterRef} />
            <div style={buttonBlockStyle}>
                <button onClick={send}>SEND</button>
                <button onClick={copy}>COPY TO CLIPBOARD</button>
                <button onClick={save}>SAVE AS</button>
                <button onClick={load}>LOAD</button>
                <div style={emptyStyle}></div>
            </div>
            <div style={rootStyle}>
                {configBlocks}
                <button style={addStyle} onClick={() => dispatch({type: "ADD"})}>ADD</button>
            </div>
            {appResult && <textarea style={textareaStyle} readOnly value={appResult}></textarea>}
        </div>
    );
}

export default App;
