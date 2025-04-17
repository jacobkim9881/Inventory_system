//const game = require("./gameInstance"); // ✅ 같은 `game` 인스턴스를 가져오기
//const { computerMove } = require("./moveHandler");
const { askPlayerMove } = require("./main"); // ✅ `askPlayerMove` 가져오기

let timeoutID = undefined;

function setTimeoutID(id) {
    timeoutID = id;
}

function getTimeoutID() {
    if (timeoutID === undefined) {
        console.warn("⚠️ timeoutID가 아직 정의되지 않았습니다!");
    }
    return timeoutID;
}

function cancelTimeout() {
    const timeoutID = getTimeoutID(); // ✅ 값이 정상적으로 설정되었는지 체크

    if (timeoutID !== undefined) {
        clearTimeout(timeoutID);
        console.log("⏳ 기존 타이머가 중지되었습니다!: ");
        
    //computerMove(game, askPlayerMove); // ✅ 동일한 `game` 인스턴스 사용
    } else {
        console.warn("🚨 timeoutID가 아직 정의되지 않았으므로 clearTimeout 실행 불가!");
    }
}

module.exports = { setTimeoutID, getTimeoutID, cancelTimeout };