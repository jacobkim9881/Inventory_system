const Inventory = require("./inventory.js");
const rl = require("./inputHandler"); // ✅ 중앙 관리되는 rl 사용
const { computerMove, askPlayerMove } = require("./moveHandler");
const { cancelTimeout } = require("./timeoutManager");

class Game {
    constructor() {
        this.playerInventory = new Inventory("Player");
        this.computerInventory = new Inventory("Computer");
        this.currentTurn = "Player";
        this.previousMove = { player: null, computer: null }; // 🔥 이전 턴 기억
    }

    switchTurn() {
        this.currentTurn = this.currentTurn === "Player" ? "Computer" : "Player";
    }

    playTurn(index) {
        let selectedInventory = this.currentTurn === "Player" ? this.playerInventory : this.computerInventory;
    
        if (this.previousMove.player === "O") {
            console.log("return10...............")
            console.log("🔄 이전 턴 기록을 초기화합니다.");
            this.previousMove = { player: null, computer: null };
    
            let exchangeCompleted = this.promptExchange(index);
            if (exchangeCompleted) {
                return 10; // 🔥 교환이 완료되면 1 반환
            }
            return 10;
        } else {
            let result = selectedInventory.chooseSlot(index);
            if (result === false) return 0; // 🔥 선택이 실패하면 0 반환
    console.log("selectedInventory.hiddenGrid[index]: ", selectedInventory.hiddenGrid[index])
            this.previousMove[this.currentTurn === "Player" ? "player" : "computer"] = selectedInventory.hiddenGrid[index];
            this.switchTurn();
        }
    console.log("return1...............")
        return 1; // 🔥 정상적으로 턴이 진행되면 1 반환
    }

    promptExchange(index) {
        if (this.currentTurn === "Player") {

            rl.question("🔄 O을 선택했습니다! 교환하시겠습니까? (Y/N): ", (answer) => {
                if (answer.toLowerCase() === "y") {
                    this.selectExchangeCards(rl);
                } else {
                    this.switchTurn();
                    let result = this.playerInventory.chooseSlot(index);
            if (result === false) return 0; // 🔥 선택이 실패하면 0 반환
            this.previousMove[this.currentTurn === "Player" ? "player" : "computer"] = this.playerInventory.hiddenGrid[index];
                    computerMove(this, askPlayerMove);
                }
                //rl.close();
            });
        } else {
            if (Math.random() > 0.5) {
                this.selectExchangeCards();
            } else {
                this.switchTurn();
            }
        }
    }

    selectExchangeCards(rl = null) {
        if (this.currentTurn === "Player") {
            rl.question("🃏 교환하고자 하는 상대방의 카드 번호를 입력하세요 (1~9): ", (enemyIndex) => {
                enemyIndex = parseInt(enemyIndex) - 1;

                rl.question("🃏 교환하고자 하는 나의 카드 번호를 입력하세요 (1~9): ", (myIndex) => {
                    myIndex = parseInt(myIndex) - 1;

                    this.handleExchange(myIndex, enemyIndex);
                    if (this.playerInventory.hiddenGrid[myIndex] === "*" || this.computerInventory.hiddenGrid[enemyIndex] === "*") {
                    } else {
                        console.log("⚠️ 선택한 카드는 이미 공개된 상태입니다. 교환 후 다시 선택해야 합니다.");
                        this.playTurn(myIndex);
                    }

                    this.switchTurn();
                    // ✅ `cancelTimeout()`을 적절한 순간에 호출하여 타이머 종료 가능

//console.log("🔎 computerMove 확인:", computerMove); // ✅ 여기서 실행해보기!
console.log("askPlayerMove 확인:", askPlayerMove); // ✅ 여기서 실행해보기!
cancelTimeout();
computerMove(this, askPlayerMove);
                });
            });
        } else {
            let enemyIndex, myIndex;
            do {
                enemyIndex = Math.floor(Math.random() * 9);
                myIndex = Math.floor(Math.random() * 9);
            } while (this.playerInventory.hiddenGrid[myIndex] !== "*" && this.computerInventory.hiddenGrid[enemyIndex] !== "*");

            this.handleExchange(myIndex, enemyIndex);
            this.switchTurn();
            // ✅ `cancelTimeout()`을 적절한 순간에 호출하여 타이머 종료 가능
cancelTimeout();
computerMove(this, askPlayerMove);
        }
    }

    handleExchange(playerSlot, computerSlot) {
        this.playerInventory.swapSlots(playerSlot, computerSlot);
        this.playerInventory.hiddenGrid[playerSlot] = "X"; // 🔥 이전 O 선택한 칸 X로 변경
        console.log(`🔄 교환 완료! '${playerSlot + 1}'번과 '${computerSlot + 1}'번 카드가 교환되었습니다.`);
    }

    displayGame() {
        console.clear();
        console.log("🎲 현재 게임 상태:");
console.log("📦1. A 아이템:", this.playerInventory.itemA, "B 아이템:", this.playerInventory.itemB);
console.log("📦2. A 아이템:", this.computerInventory.itemA, "B 아이템:", this.computerInventory.itemB);
        this.playerInventory.display();
        console.log("\n");
        this.computerInventory.display();
    }
}

module.exports = Game;