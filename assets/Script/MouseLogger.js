import { isDevMode } from "./Config.js";
const { ccclass, property } = cc._decorator;

let isLoggingEnabled = true;

@ccclass("MouseLogger")
class MouseLogger extends cc.Component {
    onLoad() {
        if (isDevMode) {
            this.node.on(cc.Node.EventType.MOUSE_DOWN, this.logMousePosition, this);

            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event) => {
                if (event.keyCode === cc.macro.KEY.F4) {
                    isLoggingEnabled = !isLoggingEnabled;
                    cc.log(`🔁 마우스 로그 ${isLoggingEnabled ? "활성화" : "비활성화"}`);
                }
            });
        }
    }

    logMousePosition(event) {
        if (!isDevMode || !isLoggingEnabled) return;
        
        let mousePos = event.getLocation(); // ✅ 마우스 클릭 위치
        let canvasPos = this.node.getPosition(); // ✅ Canvas 노드의 위치

        cc.log(`🖱️ 마우스 좌표: X=${mousePos.x}, Y=${mousePos.y}`);
        cc.log(`📍 Canvas 좌표: X=${canvasPos.x}, Y=${canvasPos.y}`);
    }
}