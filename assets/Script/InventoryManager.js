
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
            let inventoryComponent = closestInventory.getComponent("Inventory"); // ✅ 인벤토리 컴포넌트 가져오기
            
            if (inventoryComponent) {
                console.log(`✅ 가장 가까운 인벤토리 찾음: ${closestInventory.name}`);
                return inventoryComponent; // ✅ 인벤토리 컴포넌트 반환
            } else {
                console.warn("⚠️ 인벤토리 컴포넌트가 존재하지 않습니다.");
                return null;
            }
        }
    
        console.warn("⚠️ 가까운 인벤토리를 찾지 못했습니다.");
        return null;
    
    }
}