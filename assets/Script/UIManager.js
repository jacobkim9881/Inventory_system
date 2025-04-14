/**
 * UIManager.js - UI 갱신
 * 아이템의 추가 및 이동을 화면에 반영하는 기능
 */

import { enableDrag } from "./DragHandler.js";
import { inventoryManager } from "./SceneParser.js";
import { CELL_SIZE, borderPadding, cellSpacing } from "./Config.js"; // ✅ Config.js에서 CELL_SIZE 임포트

export function updateInventoryUI() {
  inventoryManager.inventories.forEach((inventory) => {
    cc.log(`인벤토리: ${inventory.name}, 아이템 개수: ${inventory.items.length}`);
  });
}

export function updateUI(inventory) {
  //inventory.node.removeAllChildren(); // 기존 UI 초기화

  let startX = -(inventory.node.width / 2) + borderPadding; // ✅ 좌측 상단 X (테두리 간격 적용)
  let startY = (inventory.node.height / 2) - borderPadding; // ✅ 좌측 상단 Y (테두리 간격 적용)


  cc.log('items at updateUI: ', inventory.items)
  inventory.items.forEach(item => {
    cc.log('updateUI1: ', item.node)
    // ✅ 기존 노드가 이미 추가되었는지 확인
           
    //let itemNode = new cc.Node("Item");
    //let sprite = itemNode.addComponent(cc.Sprite);

    // ✅ 아이템의 zIndex를 인벤토리보다 높게 설정
    item.node.zIndex = inventory.node.zIndex + 1;


    // ✅ 인벤토리 스프라이트의 좌측 상단을 기준으로 위치 조정
    let posX = startX + item.x * 100 + (CELL_SIZE/2 + cellSpacing);
    let posY = startY - item.y * 100 - (CELL_SIZE/2 + cellSpacing); // ✅ Y값은 위에서 아래로 이동
        
    cc.log('updateUI: ', item.node)
    cc.log('item.node.active', item.node.active)
    cc.log('posX: ', posX)
    cc.log('posY: ', posY)
    cc.log('item.node.setPosition: ', item.node.setPosition)

    item.node.setPosition(posX, posY);
    // ✅ 기존 이벤트가 등록되어 있는지 확인
    if (!item.node.hasEventListener(cc.Node.EventType.TOUCH_MOVE)) {
      enableDrag(item.node, item, inventory);; // ✅ 중복이 아닐 때만 enableDrag 호출
    } else {
      cc.log(`⚠️ 중복 방지: 아이템 ${item.name}에 이미 드래그 이벤트가 등록됨.`);
    }

    //inventory.node.addChild(item.node);
    cc.log('updateUI2: ', item.node)
    cc.log('inventory: ', inventory)
  });


}