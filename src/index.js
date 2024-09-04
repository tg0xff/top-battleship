import "./style.css";

const ui = new (class UI {
  constructor() {
    this.playerBoardDiv = document.querySelector("#player-board");
    this.opponentBoardDiv = document.querySelector("#opponent-board");
    this.makeGrid(this.playerBoardDiv);
    this.makeGrid(this.opponentBoardDiv);
  }
  makeGrid(boardDiv) {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const div = document.createElement("div");
        div.setAttribute("data-coords", `${y},${x}`);
        boardDiv.appendChild(div);
      }
    }
  }
})();
