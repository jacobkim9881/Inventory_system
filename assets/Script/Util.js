/**
 * Util.js - 아이템 배치 위치 검증
 * 아이템이 유효한 위치에 놓이는지 확인하는 기능을 담당
 */

/* Not used

*/

import { inventoryManager } from "./SceneParser.js";

export function loadJSONData(path, callback) {
  cc.resources.load(path, cc.JsonAsset, (err, jsonAsset) => {
      if (err) {
          console.error(`⚠️ JSON 로드 실패: ${path}`, err);
          callback(null);
          return;
      }

      callback(jsonAsset.json);
  });
}
//config에서 토탈벨류 근거해서 
export const GRID_SIZE = 3;

export function isValidPosition(x, y) {
  return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
}

export function isOccupied(x, y, inventory) {
  if (!inventory || !inventory.items) {
      console.error("❌ inventory 또는 items 속성이 없음", inventory);
      return false;
  }
  return inventory.items.some(item => item.x === x && item.y === y);
}

export function findInventoryNodes(node) {
  let inventoryNodes = [];
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

/*
export function findValidComponent(node, keyword) {
  return node._components.find(comp => comp.name.includes(keyword) && !comp.name.includes("<Sprite>"));
}
*/
export function findValidComponent(node, keyword, excludeComponent) {
  return node._components.find(comp => 
    comp.name.includes(keyword) && !comp.name.includes(`<${excludeComponent}>`)
  );
}

export function sanitizeInventoryName(componentName, excludeComponent) {
  return componentName.replace(excludeComponent, ""); // ✅ "<Sprite>" 부분 제거
}


export function findInventoryComponent(node) {
  if (!node || !node._components) {
    console.error("유효하지 않은 노드입니다.");
    return null;
  }
  return node._components.find(comp => comp.name.includes("Inventory"));
}

export function getInventoryComponentName(node, excludeComponent = "<Sprite>") {
  const inventoryComponent = findInventoryComponent(node);
  
  return inventoryComponent ? sanitizeInventoryName(inventoryComponent.name, excludeComponent) : null;
}


export function getInventory(node) {
  let inventoryComponent = findInventoryComponent(node); // ✅ 인벤토리 컴포넌트 찾기
  cc.log('inventoryComponent: ', inventoryComponent)
  let cleanName = ""; 
  let inventory = null;

  if (inventoryComponent) {
    cleanName = sanitizeInventoryName(inventoryComponent.name); // ✅ 이름 정리
    cc.log(`🟢 수정된 인벤토리 컴포넌트 이름: ${cleanName}`);
  }

  inventory = node.getComponent(cleanName); // ✅ 인벤토리 반환
  return inventory;
}


export function getClosestInventory(node) {
    if (!inventoryManager) {
        console.error("❌ inventoryManager가 초기화되지 않음");
        return null;
    }

    return inventoryManager.getClosestInventory(node); // ✅ 노드만 전달하여 검색
}