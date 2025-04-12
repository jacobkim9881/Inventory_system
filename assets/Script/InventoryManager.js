import { findInventoryComponent } from "./Util"; // ✅ Util.js에서 함수 가져오기

export class InventoryManager {
    constructor(inventories) {
        this.inventories = inventories; // ✅ 클래스 내부에서 inventories 사용
    }

    getClosestInventory(node) {
        let closestInventory = null;
        let minDistance = Infinity;

        this.inventories.forEach((inventory) => {
            let distX = Math.abs(node.x - inventory.x); // ✅ 클래스 내부의 `inventory.x` 참조
            let distY = Math.abs(node.y - inventory.y);
            let distance = Math.sqrt(distX ** 2 + distY ** 2);
//cc .log('inventory: ', inventory)
            //console.log(`인벤토리: ${inventory.name}, 아이템 개수: ${inventory.items.length}, distance: ${distance}`); // ✅ 내부 `items` 접근 가능

            if (distance < minDistance) {
                minDistance = distance;
                closestInventory = inventory;
            }
        });
        if (closestInventory) {
            let inventoryComponent = findInventoryComponent(closestInventory); // ✅ Util.js 함수 사용
            let inventory = closestInventory.getComponent(inventoryComponent?.name); // ✅ 안전하게 가져오기

            if (inventoryComponent) {
                console.log(`✅ 가장 가까운 인벤토리 찾음: ${closestInventory.name}`);
                return inventory; // ✅ 인벤토리 반환
            } else {
                console.warn("⚠️ 인벤토리 컴포넌트를 찾을 수 없습니다.");
                return null;
            }
        }

    
        console.warn("⚠️ 가까운 인벤토리를 찾지 못했습니다.");
        return null;
    
    }
}