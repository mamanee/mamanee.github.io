import {useEffect, useRef} from "react";

const useEscape = (className, callback) => {
    const onOuterClick = (e) => {
        if (e.target === document.querySelector(`.${className}`)) {
            callback();
        }
    };

    const onEscape = (e) => {
        if (e.keyCode === 27) callback();
    };

    const containerRef = useRef(null);
    useEffect(() => {
        if (!containerRef) return;
        const el = containerRef.current;
        el.addEventListener('click', onOuterClick);
        document.addEventListener('keydown', onEscape);
        return () => {
            el.removeEventListener('click', onOuterClick);
            document.removeEventListener('keydown', onEscape);
        }
    }, [containerRef]);

    return containerRef;
};

export default useEscape;
