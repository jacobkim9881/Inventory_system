const isDevMode = cc.sys.isBrowser && cc.debug;

window.dlog = (...args) => {
    if (isDevMode) {
        dlog(...args);
    }
};

window.dbg = (...args) => {
    if (isDevMode) {
        console.log(...args);
    }
};