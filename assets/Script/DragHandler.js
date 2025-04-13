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
      node.parent.zIndex = 99; // ✅ 부모 노드의 `zIndex` 높이기
    }
    let delta = event.touch.getDelta();
    node.x += delta.x;
    node.y += delta.y;
  });

  node.on(cc.Node.EventType.TOUCH_END, (event) => {
    const inventories = parseInventories(cc.director.getScene()); // ✅ 씬에서 인벤토리 가져오기
    dlog('cc.director.getScene(): ', cc.director.getScene())
    dlog('inventories: ', inventories)
    let closestInventory = getClosestInventory(node); // ✅ 겹치는 인벤토리 찾기
    dlog('closestInventory: ', closestInventory)
    // newX 계산 틀림 이슈
    if (closestInventory) {
      let startX = closestInventory.node.x - (closestInventory.node.width / 2) + borderPadding; 
      let startY = closestInventory.node.y + (closestInventory.node.width / 2) - borderPadding;

      dlog(`startX: ${startX}, closestInventory.x: ${closestInventory.node.x}, inventory width: ${closestInventory.node.width}, borderPadding: ${borderPadding}`);

      dlog('node.x - startX: ', node.x - startX)
      dlog('(CELL_SIZE + cellSpacing: ', (CELL_SIZE + cellSpacing))
      let newX = Math.abs(Math.floor((node.x - startX) / (CELL_SIZE + cellSpacing))); // ✅ x 좌표 양수 변환
      let newY = Math.abs(Math.floor((startY - node.y) / (CELL_SIZE + cellSpacing))); // ✅ y 좌표 양수 변환
      dlog('newX: ', newX)
      dlog('newY: ', newY)
      dlog(' node.x2: ',  node.x)
      dlog(' node.y2: ',  node.y)
      dlog('item: ', item)

      if (isValidPosition(newX, newY) && !isOccupied(newX, newY, closestInventory)) {
        if (item.x === newX && item.y === newY && inventory._id === closestInventory._id) { 
          dlog("⚠️ 같은 인벤토리 내에서 위치 변경 없음, 이동 작업을 수행하지 않음");
          return; // ✅ 같은 인벤토리 내 동일한 위치면 종료
        }
        item.x = newX;
        item.y = newY;
        dlog('item: ', item)
        dlog('inventory: ', inventory)
        // ✅ 새로운 인벤토리로 부모 변경
        dlog('(inventory !== closestInventory): ', (inventory !== closestInventory))
        dlog('inventory: ', inventory)
        dlog('closestInventory: ', closestInventory)
              
        if (inventory !== closestInventory) {
          dlog('(!closestInventory.hasItem(item)): ', (!closestInventory.hasItem(item)))
          if (!closestInventory.hasItem(item)) { // ✅ 이미 추가된 아이템인지 확인                        
            inventory.removeItem(item); // 기존 인벤토리에서 제거
            closestInventory.addItem(item); // 새로운 인벤토리에 추가
            dlog("✅ 아이템 이동 완료");
          } else {
            dlog("⚠️ 아이템이 이미 인벤토리에 존재합니다.");
          }
          dlog('inventory: ', inventory)
          dlog('closestInventory: ', closestInventory)
                
          //closestInventory.node.addChild(item.node);
          //closestInventory.node.setPosition(closestInventory.getGridPosition(item.x, item.y));
          //item.inventory = closestInventory; // 부모 인벤토리 변경
        } 
        
        item.node.setPosition(closestInventory.getGridPosition(item.node, newX, newY));
        
        if (node.zIndex < closestInventory.node.zIndex) { // ✅ 인벤토리보다 낮을 때만 zIndex 증가
          node.zIndex = closestInventory.node.zIndex + 1;
        }

        updateUI(inventory);
        updateUI(closestInventory);
      } else {
        node.destroy(); // 인벤토리 밖이면 제거
      }
            
    }

    node.zIndex = 1; // ✅ 터치가 끝나면 원래 `zIndex` 값으로 복구
    if (node.parent) {
      node.parent.zIndex = 0; // ✅ 부모 노드도 원래 값으로 복구
    }
  });
}


/**
 * 아이템이 겹치는 가장 가까운 인벤토리 찾기
 */
function getClosestInventory(node) {
  dlog('inventoryManager: ', inventoryManager)
  return inventoryManager.getClosestInventory(node); // ✅ 인벤토리 관리 클래스를 활용하여 찾기
}
