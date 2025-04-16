import { isValidPosition, isOccupied } from "./PositionValidator.js";
import { addItemToInventory } from "./ItemManager.js";

export function distributeItems(inventory1, inventory2, totalSlots, requiredItemACount_Inv1, requiredItemBCount_Inv1, requiredItemACount_Inv2, requiredItemBCount_Inv2) {
    const y = totalSlots - (requiredItemACount_Inv1 + requiredItemBCount_Inv1);
    const z = totalSlots - (requiredItemACount_Inv2 + requiredItemBCount_Inv2);

    if (y <= 0 || z <= 0 || z > totalSlots) {
        console.error("❌ 조건 불만족: 남은 슬롯(y, z)이 0보다 작거나, z가 전체 슬롯보다 크면 배분 불가.");
        return;
    }

    if (Math.abs(requiredItemACount_Inv1 - inventory1.aCount) + Math.abs(requiredItemBCount_Inv1 - inventory1.bCount) > z) {
        console.error("❌ 조건 불만족: 필요 아이템 개수 차이가 남은 슬롯보다 클 수 없음.");
        return;
    }

    for (let i = 0; i < requiredItemACount_Inv1 + requiredItemBCount_Inv1; i++) {
        let xPos, yPos;
        do {
            xPos = Math.floor(Math.random() * totalSlots);
            yPos = Math.floor(Math.random() * totalSlots);
        } while (!isValidPosition(xPos, yPos) || isOccupied(xPos, yPos, inventory1));

        addItemToInventory(inventory1, xPos, yPos);
    }

    for (let i = 0; i < requiredItemACount_Inv2 + requiredItemBCount_Inv2; i++) {
        let xPos, yPos;
        do {
            xPos = Math.floor(Math.random() * totalSlots);
            yPos = Math.floor(Math.random() * totalSlots);
        } while (!isValidPosition(xPos, yPos) || isOccupied(xPos, yPos, inventory2));

        addItemToInventory(inventory2, xPos, yPos);
    }
}