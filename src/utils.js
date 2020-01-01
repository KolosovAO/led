const LED_KEY = "__LED__";

const brightnessToCoeff = brightness => (brightness - 50) / 50;

const getRealColor = (color, brightness) => Math.floor(color * (0.15 + 0.05 * brightnessToCoeff(brightness)));

// const uint32ToRgb = uint32 => ({
//     r: uint32 & 0xFF,
//     g: (uint32 >> 8) & 0xFF,
//     b: (uint32 >> 16) & 0xFF
// });

export const rgbToUint32 = ({r, g, b}) => r + (g << 8) + (b << 16);

export const getRealRGB = ({r, g, b}, brightness) => {

    return {
        r: getRealColor(r, brightness),
        g: getRealColor(g, brightness),
        b: getRealColor(b, brightness)
    };
}

export const crc32 = (message) => {
    let i, j, byte, crc, mask;

    i = 0;
    crc = 0xFFFFFFFF;
    while (message[i] !== undefined) {
        byte = message[i].charCodeAt(0);
        crc = crc ^ byte;
        for (j = 7; j >= 0; j--) {
           mask = -(crc & 1);
           crc = (crc >> 1) ^ (0xEDB88320 & mask);
        }
        i += 1;
    }
    return Math.abs(~crc);
}

export const saveToLocalStorage = state => {
    if (!window.localStorage) {
        throw new Error("NO LOCALSTORAGE");
    }

    window.localStorage.setItem(LED_KEY, JSON.stringify(state));
}

export const loadFromLocalStorage = () => {
    if (!window.localStorage) {
        throw new Error("NO LOCALSTORAGE");
    }

    const rawState = window.localStorage.getItem(LED_KEY);
    if (!rawState) {
        return null;
    }
    return JSON.parse(rawState);
}

export const withLocalStorageSave = reducer => {
    return (...args) => {
        const state = reducer(...args);
        saveToLocalStorage(state);

        return state;
    }
}

export const saveStateAs = state => {
    const link = document.createElement("a");
    link.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    link.download = "state" + Date.now() + ".json";
    
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
}


export const loadState = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    return new Promise((res, rej) => {
        const rejectTimeout = setTimeout(rej, 60000);
        input.click();
        input.onchange = () => {
            const file = input.files[0];
    
            const reader = new FileReader();
            reader.onload = () => {
                clearTimeout(rejectTimeout);
                res(JSON.parse(reader.result));
            }
            reader.readAsText(file);
        }
    });
}

export const copyToClipboard = (message) => {
    navigator.clipboard.writeText(message);
}