const Game = require("./game.js");
const readline = require("readline");

const game = new Game();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askPlayerMove() {
    game.displayGame();
    rl.question("🔢 선택할 칸 번호를 입력하세요 (1~9): ", (index) => {
        index = parseInt(index);
        if (isNaN(index) || index < 1 || index > 9) {
            console.log("⚠️ 1~9 사이의 번호를 입력하세요!");
            askPlayerMove();
        } else {
            game.playTurn(index - 1);
            setTimeout(computerMove, 1000);
        }
    });
}

function computerMove() {
    let index, attempts = 0;
    do {
        index = Math.floor(Math.random() * 9);
        attempts++;
        if (attempts > 3) {
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