import {useEffect} from 'react';

let effects = [];
document.addEventListener('click', (e) => {
    for (const {cb, targetRef} of effects) {
        if (targetRef.current && !targetRef.current.contains(e.target)) {
            cb();
        }
    }
})


export const useOuterClick = (cb, targetRef) => {
    useEffect(() => {
        const effect = {cb, targetRef};
        effects.push(effect);

        return () => {
            effects = effects.filter(e => e !== effect);
        }
        // eslint-disable-next-line
    }, []);
};