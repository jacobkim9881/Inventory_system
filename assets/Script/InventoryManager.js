import { findValidComponent } from "./Util"; // ✅ Util.js에서 함수 가져오기

export class InventoryManager {
  constructor(inventories) {
    this.inventories = inventories; // ✅ 클래스 내부에서 inventories 사용
  }

  getClosestInventory(node) {
    let closestInventory = null;
    let minDistance = Infinity;
    this.inventories.forEach((inventory) => {
      let nodeWorldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
let inventoryWorldPos = inventory.convertToWorldSpaceAR(cc.v2(0, 0));

let distX = Math.abs(nodeWorldPos.x - inventoryWorldPos.x);
let distY = Math.abs(nodeWorldPos.y - inventoryWorldPos.y);

let distance = Math.sqrt(distX ** 2 + distY ** 2);
      cc .log('inventory: ', inventory)
      
      //cc.log(`노드 위치: (${node.x}, ${node.y})`);
      //cc.log(`인벤토리 위치: (${inventory.x}, ${inventory.y})`);

cc.log(`📍 closestInventory의 월드 좌표: X=${inventoryWorldPos.x}, Y=${inventoryWorldPos.y}`);
cc.log(`📍 일반 node의 월드 좌표: X=${nodeWorldPos.x}, Y=${nodeWorldPos.y}`);

cc.log(`📏 거리 계산: X=${distX}, Y=${distY}`);
      cc.log('distance: ', distance)
      if (distance < minDistance) {
        minDistance = distance;
        closestInventory = inventory;
      }
    });
    if (closestInventory) {
      let inventoryComponent = findValidComponent(closestInventory, "Inventory"); // ✅ Util.js 함수 사용
            
      if (inventoryComponent) {
        cc.log(`✅ 가장 가까운 인벤토리 찾음: ${closestInventory.name}`);
        return inventoryComponent; // ✅ 인벤토리 반환
      } else {
        console.warn("⚠️ 인벤토리 컴포넌트를 찾을 수 없습니다.");
        return null;
      }
    }

    
    console.warn("⚠️ 가까운 인벤토리를 찾지 못했습니다.");
    return null;
    
  }
}