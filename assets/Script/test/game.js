const Inventory = require("./inventory.js");

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

        let result = selectedInventory.chooseSlot(index);
        if (result === false) return;

        if (this.previousMove.player !== null || this.previousMove.computer !== null) {
            // 🔥 턴 시작 시 이전 턴 기록 초기화
            console.log("🔄 이전 턴 기록을 초기화합니다.");
            this.previousMove = { player: null, computer: null };
        
            this.promptExchange();
            
        } else {
            this.switchTurn();
        }
        
        // 🔥 O을 선택했다면 교환 여부 질문
        if (result === "O") {
            // 🔥 이전 선택한 칸 기록
        this.previousMove[this.currentTurn === "Player" ? "player" : "computer"] = index;
        }
    }

    promptExchange() {
        if (this.currentTurn === "Player") {
            const readline = require("readline").createInterface({
                input: process.stdin,
                output: process.stdout
            });

            readline.question("🔄 O을 선택했습니다! 교환하시겠습니까? (Y/N): ", (answer) => {
                if (answer.toLowerCase() === "y") {
                    this.handleExchange();
                }
                readline.close();
                this.switchTurn();
            });
        } else {
            // 🔥 컴퓨터는 자동으로 교환 실행 여부 결정 (랜덤)
            if (Math.random() > 0.5) {
                this.handleExchange();
            }
            this.switchTurn();
        }
    }

    handleExchange() {
        let playerSlot = this.previousMove.player;
        let computerSlot = this.previousMove.computer;

        if (playerSlot !== null && computerSlot !== null) {
            this.playerInventory.swapSlots(playerSlot, computerSlot);
            this.playerInventory.hiddenGrid[playerSlot] = "X"; // 🔥 이전 O 선택한 칸 X로 변경
            console.log("🔄 교환 완료! 선택했던 O 칸이 X로 변했습니다.");
        }
    }

    displayGame() {
        console.clear();
        console.log("🎲 현재 게임 상태:");
        this.playerInventory.display();
        console.log("\n");
        this.computerInventory.display();
    }
}

module.exports = Game;