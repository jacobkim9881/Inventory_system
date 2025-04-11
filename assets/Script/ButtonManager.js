/**
 * ButtonManager.js - 버튼 기능 관리
 * 아이템 추가 및 초기화를 담당하는 버튼 로직
 */

import { addItemToInventory } from "./ItemManager.js";
import { updateUI, updateInventoryUI } from "./UIManager.js";

cc.Class({
    extends: cc.Component,

    properties: {
        inventory: {
            type: cc.Node,
            default: null,
        },
        isResetButton: false, // 버튼의 기능을 구분하는 속성
    },

    onLoad() {
        this.node.on("click", this.onButtonClick, this);
    },

    onButtonClick() {
        let inventoryComponent = this.inventory.getComponent("Inventory");

        if (this.isResetButton) {
            inventoryComponent.items.forEach(item => {
                item.node.destroy(); // ✅ 아이템 스프라이트 삭제
        });

            this.inventory.getComponent("Inventory").items = []; // 모든 아이템 제거
        } else {
            addItemToInventory(this.inventory.getComponent("Inventory"));
            //updateInventoryUI(); // ✅ UI 업데이트 실행

        }
        
        updateUI(this.inventory.getComponent("Inventory")); // UI 업데이트
    },
});