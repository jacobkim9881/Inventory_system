/**
 * Util.js - 아이템 배치 위치 검증
 * 아이템이 유효한 위치에 놓이는지 확인하는 기능을 담당
 */

export const GRID_SIZE = 3;

export function isValidPosition(x, y) {
    return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
}

export function isOccupied(x, y, inventory) {
    return inventory.items.some(item => item.x === x && item.y === y);
}

export function findInventoryNodes(node) {
    let inventoryNodes = [];
cc.log('node?? ', node)
    // ✅ 현재 노드가 인벤토리 컴포넌트를 포함하는지 검사
    if (node._components.some(component => component.name.includes("Inventory"))) {
        inventoryNodes.push(node);
    }

    // ✅ 자식 노드들에 대해 동일한 검사 수행 (재귀 호출)
    node.children.forEach(childNode => {
        inventoryNodes = inventoryNodes.concat(findInventoryNodes(childNode)); // ✅ 손자 노드까지 확인
    });

    return inventoryNodes;
}

export function sanitizeInventoryName(componentName) {
    return componentName.replace("<Sprite>", ""); // ✅ "<Sprite>" 부분 제거
}

export function findInventoryComponent(node) {
    return node._components.find(comp => comp.name.includes("Inventory"));
}

export function getInventory(node) {
    let inventoryComponent = findInventoryComponent(node); // ✅ 인벤토리 컴포넌트 찾기
    let cleanName = ""; 
    let inventory = null;

    if (inventoryComponent) {
        cleanName = sanitizeInventoryName(inventoryComponent.name); // ✅ 이름 정리
        console.log(`🟢 수정된 인벤토리 컴포넌트 이름: ${cleanName}`);
    }

    inventory = node.getComponent(cleanName); // ✅ 인벤토리 반환
    return inventory;
}