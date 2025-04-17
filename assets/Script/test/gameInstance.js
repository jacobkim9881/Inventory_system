const Game = require("./game.js");

const game = new Game(); // ✅ 단일 게임 인스턴스 생성

module.exports = game; // ✅ 내보내기 (main.js & game.js에서 가져올 수 있도록)