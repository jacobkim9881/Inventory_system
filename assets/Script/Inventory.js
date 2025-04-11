import { GRID_SIZE } from "./Util.js";

/**
 * Inventory.js - 인벤토리 객체 정의
 * 인벤토리의 좌표 (x, y), 아이템 목록 및 스프라이트를 관리하는 클래스
 */
const { ccclass, property } = cc._decorator;
import { borderPadding, cellSpacing, CELL_SIZE } from "./Config"; // ✅ Config.js에서 가져오기


@ccclass
export class Inventory extends cc.Component {
    @property(cc.Sprite) sprite = null; // 인벤토리 스프라이트를 property로 설정

    onLoad() {
        this.x = 0;
        this.y = 0;
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
        this.node.addChild(item.node); // ✅ 인벤토리 UI에 추가
        item.node.setPosition(this.getGridPosition(item.x, item.y));
        
    }

    getGridPosition(item, x, y) {
        let itemWidth = item.width; // ✅ 아이템 크기 반영
        let itemHeight = item.height;
    
        let posX = - (this.node.width / 2) + (itemWidth / 2) + borderPadding + cellSpacing + (x * CELL_SIZE); // ✅ X 위치 보정
        let posY = (this.node.height / 2) - (itemHeight / 2) - borderPadding - cellSpacing - (y * CELL_SIZE); // ✅ Y 위치 보정
    
        console.log(`🟢 아이템: ${item.name}, X: ${posX}, Y: ${posY}`);
    
    
    
        return cc.v2(posX, posY); // ✅ 개별 변수로 정리하여 반환
    

    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
            item.node.destroy();
        }
    }

}