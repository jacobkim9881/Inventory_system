/**
 * SceneParser.js - 씬 내에서 'Inventory' 문자열을 포함한 인벤토리 노드를 검색하는 기능
 */

import { InventoryManager } from "./InventoryManager.js";
import { distributeItems } from "./InventoryDistribution.js"; 
import { mergeConfig, getConfig } from "./Config.js"; 
import { updateUI } from "./UIManager.js";
import { getClosestInventory, findInventoryNodes, findValidComponent } from "./Util.js";

let inventoryManager = null;

cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, () => {  
  const scene = cc.director.getScene();
  if (!scene) {
    throw new Error("❌ 씬 로드 오류: 씬이 정상적으로 로드되지 않았습니다.");
  }

  const inventories = findInventoryNodes(scene);
  inventoryManager = new InventoryManager(inventories);    
  const config = getConfig(); // ✅ 기존 설정 값 가져오기 

  cc.log("✅ inventoryManager 생성 완료:", inventoryManager);


  mergeConfig({
    TOTAL_SLOTS: config.TOTAL_SLOTS, // ✅ 기존 설정 유지
    requiredItemACount_Inv1: config.requiredItemACount_Inv1,
    requiredItemBCount_Inv1: config.requiredItemBCount_Inv1,
    requiredItemACount_Inv2: config.requiredItemACount_Inv2,
    requiredItemBCount_Inv2: config.requiredItemBCount_Inv2,
  });


  let inventory1 = getClosestInventory(inventories[0]); // ✅ 기준 노드 1에서 가까운 인벤토리 가져오기
  let inventory2 = getClosestInventory(inventories[1]); // ✅ 기준 노드 2에서 가까운 인벤토리 가져오기

  if (!inventory1 || !inventory2) {
    console.error("❌ 유효한 인벤토리를 찾지 못했습니다.");
  } else {
    distributeItems(
      inventory1,
      inventory2,
      config.TOTAL_SLOTS,
      config.requiredItemACount_Inv1,
      config.requiredItemBCount_Inv1,
      config.requiredItemACount_Inv2,
      config.requiredItemBCount_Inv2,
      config.valueA,
      config.valueB
    );
  }

  // ✅ 인벤토리에서 A와 B 아이템 개수를 추출
  let actualItemACount_Inv1 = inventory1.items.filter(item => item.type === "A").length;
  let actualItemBCount_Inv1 = inventory1.items.filter(item => item.type === "B").length;
  let actualItemACount_Inv2 = inventory2.items.filter(item => item.type === "A").length;
  let actualItemBCount_Inv2 = inventory2.items.filter(item => item.type === "B").length;
        

  // ✅ Config.js의 설정을 동적으로 변경하여 A/B 아이템 개수 저장
  mergeConfig({
    actualItemACount_Inv1: actualItemACount_Inv1,
    actualItemBCount_Inv1: actualItemBCount_Inv1,
    actualItemACount_Inv2: actualItemACount_Inv2,
    actualItemBCount_Inv2: actualItemBCount_Inv2
  });
  cc.log('config: ', config)

  
  inventories.forEach(inventoryNode => {
    let inventory = findValidComponent(inventoryNode, "Inventory", "Sprite"); 
    if (inventory) {
      updateUI(inventory); 
    }
  })
});

export { inventoryManager }; // ✅ 모듈 최상단에서만 export 가능
