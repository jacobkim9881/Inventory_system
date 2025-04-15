/**
 * DragHandler.js - 아이템 드래그 기능
 * 아이템을 터치로 이동시키고, 인벤토리 밖으로 드랍 시 제거
 */

import { parseInventories } from "./SceneParser.js";
import { isValidPosition, isOccupied, sanitizeInventoryName, getInventoryComponentName, findValidComponent} from "./Util.js";
import { updateUI } from "./UIManager.js";
import { inventoryManager } from "./SceneParser.js";
import { borderPadding, cellSpacing, CELL_SIZE } from "./Config.js";


// 아이템을 인벤1, 2에서 다시 1로 옮길 때 가려짐
// 아이템을 클릭하면 사라짐
export function enableDrag(node, item, inventory) {
  node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
    cc.log('!!!.........item: ', item)
    // 최초 터치 무브 시 원래 인덱스를 저장
    if (inventory.originalIndex < 999) {
      inventory.originalZIndex = 0; // 원래 zIndex 저장
    
      dlog('inventory.originalZIndex: ', inventory.originalZIndex)
      dlog('inventory: ', inventory)
    }
      
    if (node.zIndex < 999) { // ✅ 이미 높은 zIndex라면 변경하지 않음
      node.zIndex = 999;       
      node.parent.zIndex = 99; // ✅ 부모 노드의 `zIndex` 높이기
    }

    // 최초 터치 무브 시 item.inventory를 생성하고 인벤토리 이름 저장
    if (!item.inventoryName) {
      item.inventoryName = sanitizeInventoryName(inventory.name, "<Inventory>"); // 인벤토리의 이름 저장
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

    let inventoryWorldPos = closestInventory.node.convertToWorldSpaceAR(cc.v2(0, 0));
    cc.log(`📍 closestInventory의 월드 좌표: X=${inventoryWorldPos.x}, Y=${inventoryWorldPos.y}`);
    let nodeWorldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
    cc.log(`📍 일반 node의 월드 좌표: X=${nodeWorldPos.x}, Y=${nodeWorldPos.y}`);

    if (closestInventory) {
      let startX = inventoryWorldPos.x - (closestInventory.node.width / 2); 
      let startY = inventoryWorldPos.y + (closestInventory.node.width / 2);

      cc.log(`startX: ${startX}, closestInventory.x: ${inventoryWorldPos.x}, inventory width: ${closestInventory.node.width}, borderPadding: ${borderPadding}`);
      cc.log(`startY: ${startY}, closestInventory.y: ${inventoryWorldPos.y}, inventory width: ${closestInventory.node.width}, borderPadding: ${borderPadding}`);

      cc.log('nodeWorldPos.x - startX: ', nodeWorldPos.x - startX)
      cc.log('nodeWorldPos.y - startY: ', nodeWorldPos.y - startY)
      cc.log('(CELL_SIZE + cellSpacing: ', (CELL_SIZE + cellSpacing))
      let newX = Math.abs(Math.floor((nodeWorldPos.x - startX) / (CELL_SIZE + cellSpacing))); // ✅ x 좌표 양수 변환
      let newY = Math.abs(Math.floor((startY - nodeWorldPos.y) / (CELL_SIZE + cellSpacing))); // ✅ y 좌표 양수 변환
      cc.log('newX: ', newX)
      cc.log('newY: ', newY)
      cc.log(' nodeWorldPos.x2: ',  nodeWorldPos.x)
      cc.log(' nodeWorldPos.y2: ',  nodeWorldPos.y)
      cc.log('item: ', item)
      
      if (isValidPosition(newX, newY) && !isOccupied(newX, newY, closestInventory)) {
        if (item.x === newX && item.y === newY && item.inventoryName === closestInventory.name) {
          cc.log("⚠️ 같은 인벤토리 내에서 위치 변경 없음, 이동 작업을 수행하지 않음");
          return; // ✅ 같은 인벤토리 내 동일한 위치면 종료
        }
        item.x = newX;
        item.y = newY;
        cc.log('item: ', item)
        // ✅ 새로운 인벤토리로 부모 변경
        cc.log('(inventory !== closestInventory): ', (item.inventoryName !== closestInventory.name))
        cc.log('inventory: ', inventory)
        cc.log('closestInventory: ', closestInventory)

        const closestInventoryName = getInventoryComponentName(closestInventory.node);
        console.log("정리된 가장 가까운 인벤토리 이름:", closestInventoryName);
              
        if (item.inventoryName !== closestInventoryName) {
          cc.log('(!closestInventory.hasItem(item)): ', (!closestInventory.hasItem(item)))
          if (!closestInventory.hasItem(item)) { // ✅ 이미 추가된 아이템인지 확인                        
            const item2 = findValidComponent(closestInventory, "Inventory", "Sprite").items.some(i => i === item);
            inventory.removeItem(item); // 기존 인벤토리에서 제거
            closestInventory.addItem(item, itme2); // 새로운 인벤토리에 추가
            cc.log("✅ 아이템 이동 완료");
          } else {
            cc.log("⚠️ 아이템이 이미 인벤토리에 존재합니다.");
          }
          cc.log('inventory: ', inventory)
          cc.log('closestInventory: ', closestInventory)
          
          
          dlog('....inventory.originalZIndex: ', inventory.originalZIndex)
          dlog('......inventory: ', inventory)
          item.inventoryName = sanitizeInventoryName(closestInventory.name, "<Inventory>"); // 인벤토리의 이름 저장
          inventory.zIndex = inventory.originalZIndex; // 원래 zIndex 복귀
                
          cc.log('.........item: ', item)
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
      } else if(isValidPosition(newX, newY) && isOccupied(newX, newY, closestInventory)) {
        cc.log('아무것도 하지 않음.')
      } else {
        node.destroy(); // 인벤토리 밖이면 제거
      }
            
    }

    node.zIndex = 1; // ✅ 터치가 끝나면 원래 `zIndex` 값으로 복구
    if (node.parent) {
      dlog('node.parent: ', node.parent)
      dlog('node.parent.zIndex: ', node.parent.zIndex)
      inventory.node.zIndex = 0; // ✅ 부모 노드도 원래 값으로 복구
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
