/**
 * DragHandler.js - 아이템 드래그 기능
 * 아이템을 터치로 이동시키고, 인벤토리 밖으로 드랍 시 제거
 */

import { parseInventories } from "./SceneParser.js";
import { isValidPosition, isOccupied } from "./Util.js";
import { updateUI } from "./UIManager.js";
import { inventoryManager } from "./SceneParser.js";
import { borderPadding, cellSpacing, CELL_SIZE } from "./Config.js";



export function enableDrag(node, item, inventory) {
    node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
        if (node.zIndex < 999) { // ✅ 이미 높은 zIndex라면 변경하지 않음
            node.zIndex = 999; 
        }

        let delta = event.touch.getDelta();
        node.x += delta.x;
        node.y += delta.y;
    });

    node.on(cc.Node.EventType.TOUCH_END, (event) => {
        const inventories = parseInventories(cc.director.getScene()); // ✅ 씬에서 인벤토리 가져오기
        cc.log('cc.director.getScene(): ', cc.director.getScene())
cc.log('inventories: ', inventories)
        let closestInventory = getClosestInventory(node); // ✅ 겹치는 인벤토리 찾기
        cc.log('closestInventory: ', closestInventory)
        if (closestInventory) {
            let startX = closestInventory.x - (closestInventory.node.width / 2) + borderPadding; 
            let startY = closestInventory.y + (closestInventory.node.width / 2) - borderPadding;

            console.log(`startX: ${startX}, closestInventory.x: ${closestInventory.x}, inventory width: ${closestInventory.width}, borderPadding: ${borderPadding}`);

            cc.log('node.x - startX: ', node.x - startX)
            cc.log('(CELL_SIZE + cellSpacing: ', (CELL_SIZE + cellSpacing))
            let newX = Math.max(0, Math.floor((node.x - startX) / (CELL_SIZE + cellSpacing))); // ✅ x 좌표 음수 방지
let newY = Math.max(0, Math.floor((startY - node.y) / (CELL_SIZE + cellSpacing))); // ✅ y 좌표 음수 방지

cc.log('newX: ', newX)
cc.log('newY: ', newY)
cc.log(' node.x2: ',  node.x)
cc.log(' node.y2: ',  node.y)
cc.log('item: ', item)
if (item.x === newX && item.y === newY) {
    cc.log("⚠️ 아이템 위치 변경 없음, 이동 작업을 수행하지 않음");
    return; // ✅ 변경 없음 → 바로 종료
}


            if (isValidPosition(newX, newY) && !isOccupied(newX, newY, closestInventory)) {
                item.x = newX;
                item.y = newY;
                item.node.setPosition(closestInventory.getGridPosition(newX, newY));
                cc.log('item: ', item)
                // ✅ 새로운 인벤토리로 부모 변경
                if (item.inventory !== closestInventory) {
                    item.inventory.removeItem(item); // 기존 인벤토리에서 제거
                    closestInventory.addItem(item); // 새로운 인벤토리에 추가
                    //closestInventory.node.addChild(item.node);
                    //closestInventory.node.setPosition(closestInventory.getGridPosition(item.x, item.y));
                    item.inventory = closestInventory; // 부모 인벤토리 변경
                }

                if (node.zIndex < closestInventory.node.zIndex) { // ✅ 인벤토리보다 낮을 때만 zIndex 증가
                    node.zIndex = closestInventory.node.zIndex + 1;
                }

                //updateUI(closestInventory);
            } else {
                node.destroy(); // 인벤토리 밖이면 제거
            }
            
        }

    });
}


/**
 * 아이템이 겹치는 가장 가까운 인벤토리 찾기
 */
function getClosestInventory(node) {
    cc.log('inventoryManager: ', inventoryManager)
    return inventoryManager.getClosestInventory(node); // ✅ 인벤토리 관리 클래스를 활용하여 찾기
}
