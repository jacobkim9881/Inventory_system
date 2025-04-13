/**
 * GameManager.js - 인벤토리 UI 관리
 * 인벤토리 스프라이트에 Inventory 클래스를 추가하여 관리할 수 있도록 설정
 */

import { Inventory } from "./Inventory.js";

export class GameManager {
  constructor(rootNode, inventorySprites) {
    this.rootNode = rootNode;

    // 인벤토리 초기화
    this.inventoryA = inventorySprites[0].addComponent(Inventory);
    this.inventoryB = inventorySprites[1].addComponent(Inventory);

    this.initializeUI();
  }

  initializeUI() {
    this.rootNode.addChild(this.inventoryA.node);
    this.rootNode.addChild(this.inventoryB.node);
  }
}