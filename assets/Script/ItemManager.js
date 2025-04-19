/**
 * ItemManager.js - 아이템 추가 및 배치 로직
 * 버튼 클릭 시 새로운 아이템을 생성하여 인벤토리에 배치하는 기능
 */
import { getConfig } from "./Config.js";
import { isOccupied, isValidPosition } from "./Util.js";

export function addItemToInventory(inventory, xPos = null, yPos = null, value = 0) {

  let { x, y } = inventory;
  // ✅ 기본값 설정: xPos, yPos가 없으면 인벤토리 위치 사용
  const finalXPos = xPos !== null ? xPos : inventory.x;
  const finalYPos = yPos !== null ? yPos : inventory.y;
  const finalValue = value !== null ? value : 0;

  const GRID_SIZE = getConfig().GRID_SIZE; // ✅ 그리드 크기 설정

  if (xPos && yPos || !isOccupied(x, y, inventory)) {
    let newItem = createItemSprite(finalXPos, finalYPos, finalValue); // ✅ `value` 반영
    cc.log('inventory: ', inventory)
    cc.log('inventory.addItem: ', inventory.addItem)
    cc.log('newItem: ', newItem)
    inventory.addItem(newItem);
  } else {
    do {
      let newX = x + 1;
      if (newX >= GRID_SIZE) {
        x = 0;
        y += 1;
      } else {
        x = newX;
      }
    } while (isOccupied(x, y, inventory) && y < GRID_SIZE);

    if (isValidPosition(x, y)) {
      let newItem = createItemSprite(x, y);
      inventory.addItem(newItem);
    }
  }
}

export function fillInventoryWithItems(inventory, totalSlots, value) {  
  let arr = []; 
  const gridSize = Math.floor(Math.sqrt(totalSlots)); // ✅ 정사각형 크기 결정

  for (let xPos = 0; xPos < gridSize; xPos++) {   
      for (let yPos = 0; yPos < gridSize; yPos++) {  
          arr.push({ xPos, yPos }); // ✅ 좌표 배열에 추가
          
          if (isValidPosition(xPos, yPos) && !isOccupied(xPos, yPos, inventory)) {  
              addItemToInventory(inventory, xPos, yPos, value); // ✅ 모든 좌표에 아이템 추가  
          }  
      }  
  }  
  cc.log('find arr: ', arr); // ✅ 좌표 배열 출력
}

function createItemSprite(x, y, value) {
  let itemNode = new cc.Node("Item");
  let sprite = itemNode.addComponent(cc.Sprite);
/*
  cc.resources.load("textures/test", cc.SpriteFrame, (err, spriteFrame) => {
    if (!err) {
      sprite.spriteFrame = spriteFrame;
    }
  });
*/
 
  // ✅ textures/test 폴더 내 모든 이미지 리스트 가져오기
  cc.resources.loadDir("textures/test", cc.SpriteFrame, (err, images) => {
      if (!err && images.length > 0) {
          let randomIndex = Math.floor(Math.random() * images.length); // ✅ 랜덤 인덱스 선택
          sprite.spriteFrame = images[randomIndex]; // ✅ 랜덤한 스프라이트 적용
          cc.log("✅ 랜덤 스프라이트 적용 완료!", images[randomIndex]);
      } else {
          cc.log("⚠️ 스프라이트 로드 실패 또는 폴더가 비어 있음!");
      }
  });

  // ✅ 클릭 이벤트 추가: 클릭하면 텍스처 변경
  itemNode.on(cc.Node.EventType.TOUCH_END, () => {
    changeItemTexture(sprite);
});

  return { node: itemNode,     
    x,
    y,
    value 
  };
}

function changeItemTexture(sprite) {
  cc.resources.load("textures/test2", cc.SpriteFrame, (err, newSpriteFrame) => {
      if (!err) {
          sprite.spriteFrame = newSpriteFrame;
          cc.log("✅ 아이템 텍스처 변경 완료!");
      }
  });
}