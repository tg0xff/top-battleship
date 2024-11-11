import "./style.css";
import Player from "./classes.js";

class Game {
  constructor() {
    this.player1 = new Player(false);
    this.player2 = new Player(true);
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
    this.isPlayer1Turn = false;
    const p1AttackResult = this.player2.receiveAttack(y, x);
    if (p1AttackResult === "gameover") {
      return "player 1";
    }
    if (p1AttackResult === "miss") {
      const p2AttackResult = this.player1.receiveAttack("random");
      if (p2AttackResult === "gameover") {
        return "player 2";
      }
    }
    this.isPlayer1Turn = true;
  }
}

class UI {
  constructor() {
    this.game = new Game();

    this.announcementEl = document.querySelector("#announcement");
    this.yourBoardDiv = document.querySelector("#your-board");
    this.theirBoardDiv = document.querySelector("#their-board");
    this.randomBtn = document.querySelector("#random");
    this.startBtn = document.querySelector("#start");

    this.makeGrid(this.yourBoardDiv);
    this.makeGrid(this.theirBoardDiv);

    this.theirBoardDiv.addEventListener("click", (e) => {
      if (e.target.classList.contains("square")) {
        const [y, x] = this.getCoordsFromElement(e.target);
        const result = this.game.sendAttack(y, x);
        this.drawSquares(this.game.player2, this.theirBoardDiv);
        this.drawSquares(this.game.player1, this.yourBoardDiv);
        if (result) this.gameOver(result);
      }
    });
    this.randomBtn.addEventListener("click", () => {
      this.game.randomizeBoard();
      this.drawShips(this.game.player1, this.yourBoardDiv);
    });
    this.startBtn.addEventListener("click", this.startGame.bind(this));

    this.drawShips(this.game.player1, this.yourBoardDiv);
  }
  startGame() {
    this.disableButtons();
    this.game.gameHasStarted = true;
  }
  startNewGame() {
    this.announcementEl.textContent = "";
    this.startBtn.textContent = "Start game";
    this.startBtn.removeEventListener("click", this.startNewGame.bind(this));
    this.game = new Game();
    this.drawSquares(this.game.player1, this.yourBoardDiv);
    this.drawSquares(this.game.player2, this.theirBoardDiv);
    this.drawShips(this.game.player1, this.yourBoardDiv);
    this.startBtn.addEventListener("click", this.startGame.bind(this));
    this.enableButtons();
  }
  disableButtons() {
    this.randomBtn.setAttribute("disabled", "");
    this.startBtn.setAttribute("disabled", "");
  }
  enableButtons() {
    this.randomBtn.removeAttribute("disabled");
    this.startBtn.removeAttribute("disabled");
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
  gameOver(result) {
    this.announcementEl.textContent = `${result} wins!`.toUpperCase();
    this.startBtn.removeAttribute("disabled");
    this.startBtn.textContent = "Start a new game";
    this.startBtn.removeEventListener("click", this.startGame.bind(this));
    this.startBtn.addEventListener("click", this.startNewGame.bind(this));
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
}

const ui = new UI();
