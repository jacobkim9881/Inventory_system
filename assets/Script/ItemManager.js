/**
 * ItemManager.js - 아이템 추가 및 배치 로직
 * 버튼 클릭 시 새로운 아이템을 생성하여 인벤토리에 배치하는 기능
 */

import { GRID_SIZE, isOccupied, isValidPosition } from "./Util.js";
export function addItemToInventory(inventory) {
  let { x, y } = inventory;

  if (!isOccupied(x, y, inventory)) {
    let newItem = createItemSprite(x, y);
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

function createItemSprite(x, y) {
  let itemNode = new cc.Node("Item");
  let sprite = itemNode.addComponent(cc.Sprite);

  cc.resources.load("textures/test", cc.SpriteFrame, (err, spriteFrame) => {
    if (!err) {
      sprite.spriteFrame = spriteFrame;
    }
  });

  return { node: itemNode, x, y };
}
