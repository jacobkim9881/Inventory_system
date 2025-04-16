const isDevMode = cc.sys.isBrowser && cc.debug;

window.dlog = (...args) => {
  if (isDevMode) {
    cc.log(...args); // ✅ `cc.log()`가 자기 자신을 호출하지 않도록 수정
  }
};

window.dbg = (...args) => {
  if (isDevMode) {
    console.log(...args); // ✅ `dbg()`가 자기 자신을 호출하지 않도록 수정
  }
};