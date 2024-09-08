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
}

const game = new Game(Player, Ship, Gameboard);
