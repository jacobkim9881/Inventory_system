/**
 * Config.js - 고정된 설정값을 관리하는 스크립트
 * CELL_SIZE와 같은 게임 설정 값을 여기서 관리
 */


export const CELL_SIZE = 100; // ✅ 아이템 칸 크기 설정
export const borderPadding = 10;    // ✅ 인벤토리 테두리 간격
export const cellSpacing = 10;      // ✅ 칸과 칸 사이의 간격
export const possibleValues = [4, 9, 16]; // ✅ 제곱근이 자연수인 TOTAL_SLOTS 가능한 값

import { isDevMode, enableDebugLogs } from "../resources/env/SystemConfig.js";

// ✅ TOTAL_SLOTS 랜덤 생성 함수
function generateTotalSlots() {
    return possibleValues[Math.floor(Math.random() * possibleValues.length)];
}

// ✅ 조건을 만족하는 n, m, o, p 값 생성
function generateItemCounts(totalSlots) {
    const halfSlots = Math.floor(totalSlots / 2);

    let n = Math.floor(Math.random() * halfSlots) + 1;
    let m = Math.floor(Math.random() * (halfSlots - n)) + 1;
    let o = Math.floor(Math.random() * (totalSlots - n - m)) + 1;
    let p = totalSlots - (n + m + o); // ✅ 남은 슬롯으로 p 설정

    return { n, m, o, p };
}

// ✅ 설정 값을 초기화하는 함수
function initializeConfig() {
    const TOTAL_SLOTS = generateTotalSlots();
    const { n, m, o, p } = generateItemCounts(TOTAL_SLOTS);

    return {
        TOTAL_SLOTS,
        requiredItemACount_Inv1: n,
        requiredItemBCount_Inv1: m,
        requiredItemACount_Inv2: o,
        requiredItemBCount_Inv2: p
    };
}

// ✅ 설정 객체 선언 (초기화 + 시스템 설정 포함)
let config = {
    ...initializeConfig(),
    systemConfig: {
        isDevMode, enableDebugLogs
    } // ✅ SystemConfig에서 환경 설정 가져오기
};

export function setConfig(newConfig) {
    Object.assign(config, newConfig);
}

export function mergeConfig(newConfig) {
    for (let key in newConfig) {
        if (typeof newConfig[key] === "object" && config[key]) {
            Object.assign(config[key], newConfig[key]); // ✅ 객체 병합
        } else {
            config[key] = newConfig[key]; // ✅ 기본 값 업데이트
        }
    }
}

export function getConfig() {
    return config;
}