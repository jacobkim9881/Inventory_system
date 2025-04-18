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

function createItemSprite(x, y, value) {
  let itemNode = new cc.Node("Item");
  let sprite = itemNode.addComponent(cc.Sprite);

  cc.resources.load("textures/test", cc.SpriteFrame, (err, spriteFrame) => {
    if (!err) {
      sprite.spriteFrame = spriteFrame;
    }
  });

  return { node: itemNode,     
    x,
    y,
    value 
  };
}
