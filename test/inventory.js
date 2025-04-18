const Config = require("./config.js"); // 🔥 config.js를 test 폴더 내부에서 가져옴

class Inventory {
    constructor(name) {
        this.name = name;
        this.grid = Array(Config.totalSlots).fill(" "); // 9칸짜리 빈 공간
        this.hiddenGrid = Array(Config.totalSlots).fill("*");  // 🔥 모든 칸을 `*`로 가려둠
        this.previousO = null;
        
        let distributeItems = this.generateValidItems(Config.totalSlots); // 🔥 총 슬롯 수에 따라 필요한 아이템 개수 계산

        this.itemA = distributeItems.requiredItemA; // 🔥 A 아이템 개수
        //Math.floor(Math.random() * (9 / 2)) + 1;
        this.itemB = distributeItems.requiredItemB; // 🔥 B 아이템 개수

        // 초기 숫자 배치
        this.populateBoard();
    }
    
    generateValidItems(totalSlots) {
        let x = totalSlots;
        
        // ✅ x의 제곱근이 자연수여야 함
        if (Math.sqrt(x) % 1 !== 0) {
            throw new Error("🚨 오류: x의 제곱근이 자연수가 아닙니다!");
        }
    
        let valid = false;
        let requiredA, requiredB;
    
        while (!valid) {
            // ✅ 임의의 초기값 설정
            const maxValue = Math.floor(x / 2); // 최대값은 x의 절반
            let n = Math.floor(Math.random() * (x / 2)) + 1;
            let m = Math.floor(Math.random() * (x / 2)) + 1;
            let o = Math.floor(Math.random() * (x / 2)) + 1;
            let p = Math.floor(Math.random() * (x / 2)) + 1;
    
            // ✅ y, z 계산
            let y = x - (n + m);
            let z = 2 * x - (n + m + o + p) - y;
    
            // ✅ 조건 검증
            if (y > 0 && z > 0 && z < x) {
                requiredA = n;
                requiredB = m;

                if (n >= maxValue || m >= maxValue || o >= maxValue || p >= maxValue) {
                } else {
                valid = true; // ✅ 조건 만족 → 반복 종료
                }
            }
        }
    
        return { requiredItemA: requiredA, requiredItemB: requiredB };
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

            swapSlots(index1, index2) {
                // 🔄 기본 인벤토리 교환
                [this.grid[index1], this.grid[index2]] = [this.grid[index2], this.grid[index1]];
                
                // 🔥 hiddenGrid 교환 후 즉시 공개
                [this.hiddenGrid[index1], this.hiddenGrid[index2]] = [this.grid[index1], this.grid[index2]];
            
                console.log(`🔄 ${index1}번 슬롯과 ${index2}번 슬롯을 교환 완료!`);
                console.log(`📢 공개된 값: ${index1} → ${this.hiddenGrid[index1]}, ${index2} → ${this.hiddenGrid[index2]}`);
            }
}

module.exports = Inventory;