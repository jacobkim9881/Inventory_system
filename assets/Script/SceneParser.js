/**
 * SceneParser.js - 씬 내에서 'Inventory' 문자열을 포함한 인벤토리 노드를 검색하는 기능
 */

import { InventoryManager } from "./InventoryManager.js";
import { distributeItems } from "./InventoryDistribution.js"; 
import { mergeConfig, getConfig } from "./Config.js"; 
import { loadJSONData } from "./Utils.js"; 

let inventoryManager = null;

cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, () => {  
    const scene = cc.director.getScene();
    if (!scene) {
        throw new Error("❌ 씬 로드 오류: 씬이 정상적으로 로드되지 않았습니다.");
    }

    const inventories = parseInventories(scene);
    inventoryManager = new InventoryManager(inventories);    
    const config = getConfig(); // ✅ 기존 설정 값 가져오기

    cc.log("✅ inventoryManager 생성 완료:", inventoryManager);

    // ✅ JSON에서 기본 설정 불러오기
    loadJSONData("data/inventory_distribution_metadata", (metadata) => {
        if (!metadata) {
            console.error("⚠️ JSON 로드 실패");
            return;
        }

        cc.log("✅ JSON 설정 적용:", metadata);

        // ✅ 인벤토리에서 A와 B 아이템 개수를 추출
        let actualItemACount_Inv1 = inventories[0].items.filter(item => item.type === "A").length;
        let actualItemBCount_Inv1 = inventories[0].items.filter(item => item.type === "B").length;
        let actualItemACount_Inv2 = inventories[1].items.filter(item => item.type === "A").length;
        let actualItemBCount_Inv2 = inventories[1].items.filter(item => item.type === "B").length;

        mergeConfig({
          TOTAL_SLOTS: config.TOTAL_SLOTS, // ✅ 기존 설정 유지
          requiredItemACount_Inv1: config.requiredItemACount_Inv1,
          requiredItemBCount_Inv1: config.requiredItemBCount_Inv1,
          requiredItemACount_Inv2: config.requiredItemACount_Inv2,
          requiredItemBCount_Inv2: config.requiredItemBCount_Inv2,
      });

        // ✅ 씬 로드 후 배분 로직 실행
        distributeItems(
            inventories[0],
            inventories[1],
            metadata.environment_variables.TOTAL_SLOTS,
            metadata.environment_variables.requiredItemACount_Inv1,
            metadata.environment_variables.requiredItemBCount_Inv1,
            metadata.environment_variables.requiredItemACount_Inv2,
            metadata.environment_variables.requiredItemBCount_Inv2
        );

                // ✅ Config.js의 설정을 동적으로 변경하여 A/B 아이템 개수 저장
                mergeConfig({
                  actualItemACount_Inv1: actualItemACount_Inv1,
                  actualItemBCount_Inv1: actualItemBCount_Inv1,
                  actualItemACount_Inv2: actualItemACount_Inv2,
                  actualItemBCount_Inv2: actualItemBCount_Inv2
              });
    });
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
