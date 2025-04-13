/**
 * SceneParser.js - 씬 내에서 'Inventory' 문자열을 포함한 인벤토리 노드를 검색하는 기능
 */

import { InventoryManager } from "./InventoryManager.js";

let inventoryManager = null; // ✅ 전역으로 선언

cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, () => {
  const scene = cc.director.getScene();
    
  if (!scene) {
    throw new Error("❌ 씬 로드 오류: 씬이 정상적으로 로드되지 않았습니다.");
  }

  const inventories = parseInventories(scene);
  inventoryManager = new InventoryManager(inventories); // ✅ 씬 로드 후 인스턴스 할당

  dlog("✅ inventoryManager 생성 완료:", inventoryManager);
});

export { inventoryManager }; // ✅ 모듈 최상단에서만 export 가능


export function parseInventories(scene) { 
  let inventories = [];

  function searchInventoryNodes(node) {
    if (node.name.includes("Inventory")) { // ✅ "Inventory" 문자열 포함 여부 확인
      inventories.push(node);
    }

    node.children.forEach(child => searchInventoryNodes(child)); // ✅ 자식 노드도 검사
  }

  scene.children.forEach(rootNode => searchInventoryNodes(rootNode)); // ✅ 루트 노드부터 검사


  return inventories; // ✅ 모든 인벤토리를 배열로 반환
}
