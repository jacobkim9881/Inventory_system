const game = require("./gameInstance"); // ✅ 게임 인스턴스 가져오기
const { askPlayerMove } = require("./moveHandler"); // ✅ `askPlayerMove`를 moveHandler에서 가져오기

askPlayerMove(game); // ✅ 게임 인스턴스를 전달하여 실행!