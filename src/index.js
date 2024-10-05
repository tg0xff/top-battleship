import "./style.css";
import { Player, Gameboard, Ship } from "./classes.js";

class Game {
  constructor(Player, Ship, Gameboard) {
    this.player = new Player(true, Ship, Gameboard);
    this.cpu = new Player(false, Ship, Gameboard);
    this.gameHasStarted = false;

    this.playerBoardDiv = document.querySelector("#player-board");
    this.opponentBoardDiv = document.querySelector("#opponent-board");
    this.opponentBoardDiv.addEventListener("click", (e) => this.sendAttack(e));
    this.randomBtn = document.querySelector("#random");
    this.randomBtn.addEventListener("click", this.randomizeBoard.bind(this));
    this.startBtn = document.querySelector("#start");

    this.makeGrid(this.playerBoardDiv);
    this.makeGrid(this.opponentBoardDiv);
    this.drawShips(this.player, this.playerBoardDiv);
  }
  makeGrid(boardDiv) {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const div = document.createElement("div");
        div.className = "square";
        div.style["grid-area"] = `${x + 1} / ${y + 1}`;
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
  sendAttack(e) {
    if (!this.gameHasStarted) return;
    if (!e.target.classList.contains("square")) return;
    const [x, y] = e.target.getAttribute("data-coords").split(",");
    this.cpu.gameboard.receiveAttack(y, x);
    if (this.cpu.gameboard.shipIndexBoard[y][x] !== -1) {
      e.target.textContent = "☠️";
    } else {
      e.target.textContent = "⚫️";
    }
  }
}

const game = new Game(Player, Ship, Gameboard);
