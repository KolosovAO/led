import React, {useReducer} from 'react';
import { ConfigBlock } from './config-block';
import { CanvasRenderer } from './canvas-renderer';
import { getColorsArr } from './utils';


const createConfig = () => ({
    ledCount: 0,
    rgb: {
        r: 0,
        g: 0,
        b: 0
    },
    brightness: 50,
    gradient: true,
    secondColor: null
});

const configKeys = [0, 1, 2, 3, 4, 5, 6, 7];

const initialState = Object.fromEntries(configKeys.map(key => [key, createConfig()]));

const reducer = (state, action) => {
    const idx = action.idx;
    switch (action.type) {
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
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const configBlocks = configKeys.map(key =>
        <ConfigBlock
            key={key}
            rgb={state[key].rgb}
            setRgb={(rgb) => dispatch({type: "SET_RGB", payload: rgb, idx: key})}
            brightness={state[key].brightness}
            setBrightness={(brightness) => dispatch({type: "SET_BRIGHTNESS", payload: brightness, idx: key})}
            ledCount={state[key].ledCount}
            setLedCount={(ledCount) => dispatch({type: "SET_LED_COUNT", payload: ledCount, idx: key})}
            gradient={state[key].gradient}
            setGradient={(gradient) => dispatch({type: "SET_GRADIENT", payload: gradient, idx: key})}
            secondColor={state[key].secondColor}
            setSecondColor={(secondColor) => dispatch({type: "SET_SECOND_COLOR", payload: secondColor, idx: key})}
        />
    );

    const blocks = configKeys.map(key => state[key]);
    
    return (
        <div>
            <div style={rootStyle}>
                {configBlocks}
            </div>
            <CanvasRenderer blocks={blocks}/>
            <button onClick={() => console.log(getColorsArr(blocks))}>get colors arr</button>
        </div>
    );
}

export default App;
