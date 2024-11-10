import "./style.css";
import Player from "./classes.js";

class Game {
  constructor() {
    this.player1 = new Player(true);
    this.player2 = new Player(false);
    this.gameHasStarted = false;
    this.isPlayer1Turn = true;
  }
  randomizeBoard() {
    if (this.gameHasStarted) return;
    this.player1.board.placeShipsRandomly();
  }
  sendAttack(y, x) {
    if (
      !this.gameHasStarted ||
      !this.isPlayer1Turn ||
      !this.player2.board.canBeAttacked(y, x)
    )
      return;
    const attackResult = this.player2.board.receiveAttack(y, x);
    if (attackResult === "miss") {
      this.isPlayer1Turn = false;
      this.makeCPUAttack();
    }
  }
  makeCPUAttack() {
    let keepGoing = true;
    while (keepGoing) {
      let x;
      let y;
      do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
      } while (!this.player1.board.canBeAttacked(y, x));
      const attackResult = this.player1.board.receiveAttack(y, x);
      keepGoing = attackResult === "hit";
    }
    this.isPlayer1Turn = true;
  }
}

class UI {
  constructor() {
    this.game = new Game();

    this.yourBoardDiv = document.querySelector("#your-board");
    this.theirBoardDiv = document.querySelector("#their-board");
    this.randomBtn = document.querySelector("#random");
    this.startBtn = document.querySelector("#start");

    this.theirBoardDiv.addEventListener("click", (e) => {
      if (e.target.classList.contains("square")) {
        const [y, x] = this.getCoordsFromElement(e.target);
        this.game.sendAttack(y, x);
        this.drawSquares(this.game.player2, this.theirBoardDiv);
        this.drawSquares(this.game.player1, this.yourBoardDiv);
      }
    });
    this.randomBtn.addEventListener("click", () => {
      this.game.randomizeBoard();
      this.drawShips(this.game.player1, this.yourBoardDiv);
    });
    this.startBtn.addEventListener("click", () => {
      this.disableButtons();
      this.game.gameHasStarted = true;
    });

    this.makeGrid(this.yourBoardDiv);
    this.makeGrid(this.theirBoardDiv);
    this.drawShips(this.game.player1, this.yourBoardDiv);
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
  disableButtons() {
    this.randomBtn.setAttribute("disabled", "");
    this.startBtn.setAttribute("disabled", "");
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
  getCoordsFromElement(element) {
    return element
      .getAttribute("data-coords")
      .split(",")
      .map((x) => +x);
  }
  drawSquares(player, gridElement) {
    const squares = gridElement.querySelectorAll(".square");
    squares.forEach((square) => {
      const [y, x] = this.getCoordsFromElement(square);
      square.textContent = player.board.getSquareState(y, x);
    });
  }
}

const ui = new UI();
