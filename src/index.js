import "./style.css";
import { Player, Gameboard, Ship } from "./classes.js";

class Game {
  constructor(Player, Ship, Gameboard) {
    this.player = new Player(true, Ship, Gameboard);
    this.cpu = new Player(false, Ship, Gameboard);
    this.playerBoardDiv = document.querySelector("#player-board");
    this.opponentBoardDiv = document.querySelector("#opponent-board");
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
    for (const ship of player.gameboard.ships) {
      const div = document.createElement("div");
      div.className = "ship";
      if (ship.orientation === "v") {
        div.style["grid-area"] = `${ship.y + 1} / ${ship.x + 1} / span ${ship.length}`;
      } else if (ship.orientation === "h") {
        div.style["grid-area"] = `${ship.y + 1} / ${ship.x + 1} / span 1 / span ${ship.length}`;
      }
      boardDiv.appendChild(div);
    }
  }
}

const game = new Game(Player, Ship, Gameboard);
