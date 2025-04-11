
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

            console.log(`인벤토리: ${inventory.name}, 아이템 개수: ${inventory.items.length}, distance: ${distance}`); // ✅ 내부 `items` 접근 가능

            if (distance < minDistance) {
                minDistance = distance;
                closestInventory = inventory;
            }
        });

        return closestInventory;
    }
}