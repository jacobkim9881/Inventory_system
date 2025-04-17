const Config = require("./config.js"); // 🔥 config.js를 test 폴더 내부에서 가져옴

class Inventory {
    constructor(name) {
        this.name = name;
        this.grid = Array(Config.totalSlots).fill(" "); // 9칸짜리 빈 공간
        this.hiddenGrid = Array(Config.totalSlots).fill("*");  // 🔥 모든 칸을 `*`로 가려둠
        this.itemA = Config.requiredItemA;
        this.itemB = Config.requiredItemB;
        this.previousO = null;
        


        // 초기 숫자 배치
        this.populateBoard();
    }

    populateBoard() {
        let itemList = Array(this.itemA).fill("A")
            .concat(Array(this.itemB).fill("B"))
            .concat(Array(Config.totalSlots - this.itemA - this.itemB).fill("O"));
        itemList = this.shuffleArray(itemList);

        this.grid = itemList;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
        display() {
            console.log(`📦 ${this.name} 인벤토리`);
            for (let i = 0; i < 9; i += 3) {
                console.log(`${this.hiddenGrid[i]} | ${this.hiddenGrid[i+1]} | ${this.hiddenGrid[i+2]}`);
            }
        }
        
            chooseSlot(index) {  // 🔥 ✅ 메서드가 정확히 존재해야 함
                if (this.hiddenGrid[index] === "*") {
                    //this.grid[index] = Math.random() > 0.5 ? "A" : "B";
                    this.hiddenGrid[index] = this.grid[index];  // 🔥 선택한 위치의 실제 값 공개
                    
                    return true;
                } else {
                    console.log("⚠️ 이미 선택된 위치입니다.");
                    return false;
                }
            }

}

module.exports = Inventory;