import "./style.css";
import Player from "./classes.js";

class Game {
  constructor() {
    this.player1 = new Player(true);
    this.player2 = new Player(false);
    this.gameHasStarted = false;
    this.isPlayer1Turn = true;

    this.player1BoardDiv = document.querySelector("#player-board");
    this.player2BoardDiv = document.querySelector("#opponent-board");
    this.randomBtn = document.querySelector("#random");
    this.startBtn = document.querySelector("#start");

    this.player2BoardDiv.addEventListener("click", (e) => this.sendAttack(e));
    this.randomBtn.addEventListener("click", this.randomizeBoard.bind(this));
    this.startBtn.addEventListener("click", () => (this.gameHasStarted = true));

    this.makeGrid(this.player1BoardDiv);
    this.makeGrid(this.player2BoardDiv);
    this.drawShips(this.player1, this.player1BoardDiv);
  }
  makeGrid(boardDiv) {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const div = document.createElement("div");
        div.className = "square";
        div.style["grid-area"] = `${y + 1} / ${x + 1}`;
        div.setAttribute("data-coords", `${y},${x}`);
        boardDiv.appendChild(div);
      }
    }
  }
  drawShips(player, boardDiv) {
    const shipDivs = boardDiv.querySelectorAll(".ship");
    shipDivs.forEach((div) => div.parentNode.removeChild(div));

    for (const ship of player.board.ships) {
      const div = document.createElement("div");
      div.className = "ship";
      if (ship.isHorizontal) {
        div.style["grid-area"] =
          `${ship.y + 1} / ${ship.x + 1} / span 1 / span ${ship.length}`;
      } else {
        div.style["grid-area"] =
          `${ship.y + 1} / ${ship.x + 1} / span ${ship.length}`;
      }
      boardDiv.appendChild(div);
    }
  }
  randomizeBoard() {
    if (this.gameHasStarted) return;
    this.player1.board.placeShipsRandomly();
    this.drawShips(this.player1, this.player1BoardDiv);
  }
  drawSquares(player, gridElement) {
    const squares = gridElement.querySelectorAll(".square");
    squares.forEach((square) => {
      const [y, x] = square.getAttribute("data-coords").split(",");
      square.textContent = player.board.getSquareState(y, x);
    });
  }
  sendAttack(e) {
    if (
      !this.gameHasStarted ||
      !this.isPlayer1Turn ||
      !e.target.classList.contains("square")
    )
      return;
    const [y, x] = e.target.getAttribute("data-coords").split(",");
    if (!this.player2.board.canBeAttacked(y, x)) return;
    this.player2.board.receiveAttack(y, x);
    this.drawSquares(this.player2, this.player2BoardDiv);
    this.isPlayer1Turn = false;
    this.makeCPUAttack();
  }
  makeCPUAttack() {
    let x;
    let y;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (!this.player1.board.canBeAttacked(y, x));
    this.player1.board.receiveAttack(y, x);
    this.drawSquares(this.player1, this.player1BoardDiv);
    this.isPlayer1Turn = true;
  }
}

const game = new Game();
