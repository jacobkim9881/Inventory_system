const rl = require("./inputHandler"); // ✅ 중앙 관리되는 rl 사용
const { setTimeoutID } = require("./timeoutManager");

function askPlayerMove(game) {
    
console.log('game.displayGame: ', game.displayGame); // ✅ 게임 인스턴스 확인
console.log('game: ', game); // ✅ 게임 인스턴스 확인
    game.displayGame(); // 🔥 게임 상태를 먼저 출력

    rl.question("🔢 선택할 칸 번호를 입력하세요 (1~9): ", (index) => {
        index = parseInt(index);

        if (isNaN(index) || index < 1 || index > 9) {
            console.log("⚠️ 1~9 사이의 번호를 입력하세요!");
            askPlayerMove(game); // ✅ 다시 요청
        } else {
            let completed = game.playTurn(index - 1); // 🔥 playTurn 실행 후 반환값 활용
            
            if (completed === 10) {
                const timeout = setTimeout(() => {
                    computerMove(game, askPlayerMove); // ✅ game과 askPlayerMove를 인자로 전달!
                }, 100000); // 🔥 교환이 완료되면 100초 후 컴퓨터 턴 진행
                
                setTimeoutID(timeout);
            } else if (completed) {
                console.log("setTimeout");
                setTimeout(() => {
                    computerMove(game, askPlayerMove); // ✅ game과 askPlayerMove를 인자로 전달!
                }, 1000); // 🔥 모든 실행이 끝난 후에만 다음 턴 진행
            } else {
                askPlayerMove(game); // 🔥 선택이 잘못되었을 경우 다시 입력 요청
            }
        }
    });
}

function computerMove(game, askPlayerMove) {
    if (!game) {
    console.log("🔎 game 객체 확인:", game);
    }
    let index, attempts = 0;

    do {
        index = Math.floor(Math.random() * 9);
        attempts++;

        if (attempts > 100) {
            console.log("⚠️ 컴퓨터가 선택할 수 없는 상태! 턴을 넘깁니다.");
            game.switchTurn();
            askPlayerMove(game); // ✅ 직접 전달받은 함수 호출
            return;
        }
    } while (!game.computerInventory.chooseSlot(index, false));

    game.switchTurn();
    askPlayerMove(game); // ✅ 직접 전달받은 함수 호출
}

// ✅ 함수 외부에서 게임 객체를 주입받도록 수정
module.exports = { askPlayerMove, computerMove };