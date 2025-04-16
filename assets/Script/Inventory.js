import { GRID_SIZE } from "./Util.js";

/**
 * Inventory.js - 인벤토리 객체 정의
 * 인벤토리의 좌표 (x, y), 아이템 목록 및 스프라이트를 관리하는 클래스
 */
const { ccclass, property } = cc._decorator;
import { borderPadding, cellSpacing, CELL_SIZE } from "./Config"; // ✅ Config.js에서 가져오기
import { findInventoryComponent, findValidComponent, getInventoryComponentName } from "./Util.js"; // ✅ 인벤토리 찾는 함수 임포트 추가


@ccclass
export class Inventory extends cc.Component {
    @property(cc.Sprite) sprite = null; // 인벤토리 스프라이트를 property로 설정

    onLoad() {
        this.x = 0;
        this.y = 0;
        this.items = [];
    }

    
        hasItem(targetItem) {
            return this.items.some(item =>
                item === targetItem || (item.children && this.hasItemRecursive(item.children, targetItem))
            );
        }
    
        hasItemRecursive(items, targetItem) {
            return items.some(item =>
                item === targetItem || (item.children && this.hasItemRecursive(item.children, targetItem))
            );
        }

        addItem(item, item2) {
            const inventoryComponent = findInventoryComponent(this.node);
            cc.log('this.node', this.node)
            console.log("📌 inventoryComponent의 속성들:", Object.keys(findValidComponent(this.node, "Inventory", "Sprite")));
            console.log("📌 inventoryComponent.items 타입:", typeof findValidComponent(this.node, "Inventory", "Sprite").items);
            const items = findValidComponent(this.node, "Inventory", "Sprite").items;
            console.log("📌 현재 items 배열:", items);
            
        cc.log('item2: ', item2)
            console.log("📌 현재 this.items 배열:", this.items);
console.log("📌 this.items.length:", this.items.length);
console.log("📌 this.items[0]:", this.items[0]); // ✅ 첫 번째 요소가 존재하는지 확인
            
            if (Array.isArray(findValidComponent(this.node, "Inventory", "Sprite").items)) {
                console.log("✅ inventoryComponent.items 접근 가능! 현재 목록:", findValidComponent(this.node, "Inventory", "Sprite").items[0]); 
             } else {
                console.log("⚠️ inventoryComponent.items가 배열이 아닙니다. 속성 접근 문제일 가능성 있음!");
            }

cc.log('findValidComponent: ', findValidComponent(this.node, "Inventory", "Sprite"))
if (findValidComponent(this.node, "Inventory", "Sprite").items){ 
cc.log('findValidComponent = item: ', findValidComponent(this.node, "Inventory", "Sprite").items.some(i => i === item)) 
//cc.log('findValidComponent.item: ', findValidComponent(this.node, "Inventory", "Sprite").items[0]) 
cc.log('item: ', item) 
cc.log('item id: ', item.node._id)  
} 
                // ✅ 아이템이 현재 인벤토리에 이미 추가되어 있는지 확인
                if (findValidComponent(this.node, "Inventory", "Sprite").items && findValidComponent(this.node, "Inventory", "Sprite").items.some(i => i.node === item)) {
                    cc.log("⚠️ 아이템이 이미 인벤토리에 존재합니다:", item);
                    return; // ✅ 중복 추가 방지
                }
if (!inventoryComponent) {
    console.log("⚠️ 인벤토리 컴포넌트를 찾을 수 없습니다!");
    return;
}
 
// ✅ items 배열이 존재하지 않거나 길이가 0이면 초기화
if (!inventoryComponent.items || inventoryComponent.items.length === 0) {
    console.log("⚠️ inventoryComponent.items가 정의되지 않았거나 비어 있음!");
    inventoryComponent.items = []; // ✅ 기본값 설정
}

if (inventoryComponent.items.some(i => i === item)) {  
    cc.log("⚠️ 아이템이 이미 존재합니다!");
    return; 
}
        
            this.items.push(item);
            this.node.addChild(item.node);
            item.node.setPosition(this.getGridPosition(item, item.x, item.y)); 
        }

    getGridPosition(item, x, y) {
        let itemWidth = item.width; // ✅ 아이템 크기 반영
        let itemHeight = item.height;
    
        let posX = - (this.node.width / 2) + (itemWidth / 2) + borderPadding + cellSpacing + (x * CELL_SIZE); // ✅ X 위치 보정
        let posY = (this.node.height / 2) - (itemHeight / 2) - borderPadding - cellSpacing - (y * CELL_SIZE); // ✅ Y 위치 보정
    
        cc.log(`🟢 아이템: ${item.name}, X: ${posX}, Y: ${posY}`);
    
    
    
        return cc.v2(posX, posY); // ✅ 개별 변수로 정리하여 반환
    

    }

    removeItem(item) {
            this.items = this.items.filter(i => i !== item);
            
            if (item.node.parent === this.node) { 
                item.node.removeFromParent(false); // ✅ 부모 노드에서만 제거, 노드 자체는 유지
            }
        
            item.inventory = null; // ✅ 인벤토리 참조 제거
    }

}