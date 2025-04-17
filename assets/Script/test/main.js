const Game = require("./game.js");
const rl = require("./inputHandler"); // ✅ 중앙 관리되는 rl 사용

const game = new Game();

function askPlayerMove() {
    game.displayGame(); // 🔥 게임 상태를 먼저 출력

    rl.question("🔢 선택할 칸 번호를 입력하세요 (1~9): ", (index) => {
        index = parseInt(index);

        if (isNaN(index) || index < 1 || index > 9) {
            console.log("⚠️ 1~9 사이의 번호를 입력하세요!");
            askPlayerMove();
        } else {
            let completed = game.playTurn(index - 1); // 🔥 playTurn 실행 후 반환값 활용            
            if (completed === 10) {

            } else if(completed) {

                
                console.log('setTimeout')
                setTimeout(computerMove, 1000); // 🔥 모든 실행이 끝난 후에만 다음 턴 진행
            } else {
                askPlayerMove(); // 🔥 선택이 잘못되었을 경우 다시 입력 요청
            }
        }
    });
}

function computerMove() {
    let index, attempts = 0;
    do {
        index = Math.floor(Math.random() * 9);
        attempts++;
        if (attempts > 100) {
            console.log("⚠️ 컴퓨터가 선택할 수 없는 상태! 턴을 넘깁니다.");
            game.switchTurn();
            askPlayerMove();
            return;
        }
    } while (!game.computerInventory.chooseSlot(index, false));

    game.switchTurn();
    askPlayerMove();
}

askPlayerMove();