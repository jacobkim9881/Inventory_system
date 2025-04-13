/**
 * PositionValidator.js - 아이템 배치 위치 검증
 * 아이템이 유효한 위치에 놓이는지 확인하는 기능
 */

export function isValidPosition(x, y) {
  return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
}

export function isOccupied(x, y, inventory) {
  return inventory.items.some(item => item.x === x && item.y === y);
}