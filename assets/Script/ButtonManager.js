/**
 * ButtonManager.js - 버튼 기능 관리
 * 아이템 추가 및 초기화를 담당하는 버튼 로직
 */

import { addItemToInventory } from "./ItemManager.js";
import { updateUI } from "./UIManager.js";
import { findInventoryNodes, getInventory, findValidComponent } from "./Util";

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

        if (this.isResetButton) {
            // ✅ 현재 씬에서 모든 노드 가져오기
    let scene = cc.director.getScene();
    let inventoryNodes = findInventoryNodes(scene);
    cc.log('scene.children. ', scene.children)
cc.log('inventoryNodes: ', inventoryNodes)
    inventoryNodes.forEach(inventoryNode => {
        
let inventory = findValidComponent(inventoryNode, "Inventory"); 

        if (inventory) {
                inventory.items.forEach(item => {
                    item.node.removeComponent(cc.Sprite); // ✅ 스프라이트 제거
                    item.node.destroy(); // ✅ 아이템 노드 제거
                });
                inventory.items = [];
                console.log(`🗑️ 인벤토리 ${inventoryNode.name} 아이템 및 스프라이트 제거 완료!`);
            } else {
                console.warn(`⚠️ Inventory 컴포넌트를 찾을 수 없음: ${inventoryNode.name}`);
            }
            
        cc.log('inventory at foreach: ',inventory)
    });

  //  📌 2️⃣  반복문이 끝난 후 실행해야 함
//✔️ 루프 내부에서 실행하면, 아이템이 완전히 제거되기 전에 UI가 업데이트될 수 있

    inventoryNodes.forEach(inventoryNode => {
        let inventory = findValidComponent(inventoryNode, "Inventory"); 
        if (inventory) {
            updateUI(inventory); // ✅ 루프 종료 후 UI 업데이트
        }
    });

    console.log("✅ 모든 인벤토리 아이템이 제거되었습니다!");


       
        } else {
            cc.log('this.inventory: ', this.inventory)
            addItemToInventory(this.inventory.getComponent("Inventory"));
            //updateInventoryUI(); // ✅ UI 업데이트 실행

            updateUI(this.inventory.getComponent("Inventory")); // UI 업데이트
        }
    },
});