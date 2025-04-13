import { findValidComponent } from "./Util"; // ✅ Util.js에서 함수 가져오기

export class InventoryManager {
  constructor(inventories) {
    this.inventories = inventories; // ✅ 클래스 내부에서 inventories 사용
  }

  getClosestInventory(node) {
    let closestInventory = null;
    let minDistance = Infinity;
    // 가장 가까운 인벤토리 못찾는 이슈
    this.inventories.forEach((inventory) => {
      let distX = Math.abs(node.x - inventory.x); // ✅ 클래스 내부의 `inventory.x` 참조
      let distY = Math.abs(node.y - inventory.y);
      let distance = Math.sqrt(distX ** 2 + distY ** 2);
      cc .log('inventory: ', inventory)
      //dlog(`인벤토리: ${inventory.name}, 아이템 개수: ${inventory.items.length}, distance: ${distance}`); // ✅ 내부 `items` 접근 가능
      dlog(`노드 위치: (${node.x}, ${node.y})`);
      dlog(`인벤토리 위치: (${inventory.x}, ${inventory.y})`);
      dlog(`X축 거리 계산: Math.abs(${node.x} - ${inventory.x}) = ${Math.abs(node.x - inventory.x)}`);
      dlog(`Y축 거리 계산: Math.abs(${node.y} - ${inventory.y}) = ${Math.abs(node.y - inventory.y)}`);
      if (distance < minDistance) {
        minDistance = distance;
        closestInventory = inventory;
      }
    });
    if (closestInventory) {
      let inventoryComponent = findValidComponent(closestInventory, "Inventory"); // ✅ Util.js 함수 사용
            
      if (inventoryComponent) {
        dlog(`✅ 가장 가까운 인벤토리 찾음: ${closestInventory.name}`);
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