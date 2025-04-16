import { getConfig } from "./Config.js";
const { ccclass, property } = cc._decorator;

@ccclass("MouseLogger")
class MouseLogger extends cc.Component {
    onLoad() {
        const config = getConfig(); // ✅ Config.js에서 설정 가져오기
        const isDevMode = config.systemConfig.isDevMode; // ✅ systemConfig 내부의 값 참조
        let isLoggingEnabled = config.systemConfig.isLoggingEnabled; // ✅ systemConfig에서 초기 값 설정

        if (isDevMode) {
            this.node.on(cc.Node.EventType.MOUSE_DOWN, this.logMousePosition, this);

            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event) => {
                if (event.keyCode === cc.macro.KEY.F4) {
                    isLoggingEnabled = !isLoggingEnabled; // ✅ 동적으로 값 변경
                    cc.log(`🔁 마우스 로그 ${isLoggingEnabled ? "활성화" : "비활성화"}`);
                }
            });
        }
    }

    logMousePosition(event) {
        const config = getConfig();
        if (!config.systemConfig.isDevMode || !config.systemConfig.isLoggingEnabled) return;

        let mousePos = event.getLocation(); // ✅ 마우스 클릭 위치
        let canvasPos = this.node.getPosition(); // ✅ Canvas 노드의 위치

        cc.log(`🖱️ 마우스 좌표: X=${mousePos.x}, Y=${mousePos.y}`);
        cc.log(`📍 Canvas 좌표: X=${canvasPos.x}, Y=${canvasPos.y}`);
    }
}