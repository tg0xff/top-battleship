import "./style.css";
import { Player, Gameboard, Ship } from "./classes.js";

class Game {
  constructor(Player, Ship, Gameboard) {
    this.player = new Player(true, Ship, Gameboard);
    this.cpu = new Player(false, Ship, Gameboard);
    this.gameHasStarted = false;
    this.isPlayerOnesTurn = true;

    this.playerBoardDiv = document.querySelector("#player-board");
    this.cpuBoardDiv = document.querySelector("#opponent-board");
    this.randomBtn = document.querySelector("#random");
    this.startBtn = document.querySelector("#start");

    this.cpuBoardDiv.addEventListener("click", (e) => this.sendAttack(e));
    this.randomBtn.addEventListener("click", this.randomizeBoard.bind(this));
    this.startBtn.addEventListener("click", () => (this.gameHasStarted = true));

    this.makeGrid(this.playerBoardDiv);
    this.makeGrid(this.cpuBoardDiv);
    this.drawShips(this.player, this.playerBoardDiv);
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

    for (const ship of player.gameboard.ships) {
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
    this.player.gameboard.placeShipsRandomly();
    this.drawShips(this.player, this.playerBoardDiv);
  }
  drawSquares(player, gridElement) {
    const squares = gridElement.querySelectorAll(".square");
    squares.forEach((square) => {
      const [y, x] = square.getAttribute("data-coords").split(",");
      square.textContent = player.gameboard.getSquareState(y, x);
    });
  }
  sendAttack(e) {
    if (
      !this.gameHasStarted ||
      !this.isPlayerOnesTurn ||
      !e.target.classList.contains("square")
    )
      return;
    const [y, x] = e.target.getAttribute("data-coords").split(",");
    if (!this.cpu.gameboard.canBeAttacked(y, x)) return;
    this.cpu.gameboard.receiveAttack(y, x);
    this.drawSquares(this.cpu, this.cpuBoardDiv);
    this.isPlayerOnesTurn = false;
    this.makeCPUAttack();
  }
  makeCPUAttack() {
    let x;
    let y;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (!this.player.gameboard.canBeAttacked(y, x));
    this.player.gameboard.receiveAttack(y, x);
    this.drawSquares(this.player, this.playerBoardDiv);
    this.isPlayerOnesTurn = true;
  }
}

const game = new Game(Player, Ship, Gameboard);
