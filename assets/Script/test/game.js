const Inventory = require("./inventory.js");

class Game {
    constructor() {
        this.playerInventory = new Inventory("Player");
        this.computerInventory = new Inventory("Computer");
        this.currentTurn = "Player";
        this.failedAttempts = 0;
    }

    switchTurn() {
        this.currentTurn = this.currentTurn === "Player" ? "Computer" : "Player";
    }

    playTurn(index) {
        let selectedInventory = this.currentTurn === "Player" ? this.playerInventory : this.computerInventory;

        let result = selectedInventory.chooseSlot(index, this.currentTurn === "Player");
        if (result === false) {
            this.failedAttempts++;
            if (this.failedAttempts > 3) {
                console.log("⛔️ 반복된 선택 불가 상태! 게임을 종료합니다.");
                process.exit(0);
            }
        } else {
            this.failedAttempts = 0;
            this.switchTurn();
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