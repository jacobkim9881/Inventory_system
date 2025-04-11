import { GRID_SIZE } from "./Util.js";

/**
 * Inventory.js - 인벤토리 객체 정의
 * 인벤토리의 좌표 (x, y), 아이템 목록 및 스프라이트를 관리하는 클래스
 */
const { ccclass, property } = cc._decorator;

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

    getGridPosition(x, y) { 
        const CELL_SIZE = 100;
        let startX = this.node.x - (this.node.width / 2); // ✅ 인벤토리 좌측 상단 X
        let startY = this.node.y + (this.node.height / 2); // ✅ 인벤토리 좌측 상단 Y

        return cc.v2(startX + x * CELL_SIZE, startY - y * CELL_SIZE);

    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
            item.node.destroy();
        }
    }

}