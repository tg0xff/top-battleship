import placeShipsRandomly from "./place-ships.js";

export const EMPTY = -1;
const DISREGARDED = -2;
const HIT = -3;
const DAMAGED = -4;

export class Ship {
  constructor() {
    this.hits = 0;
    this.length;
    this.isHorizontal;
  }
  hit() {
    this.hits++;
  }
  isSunk() {
    return this.hits >= this.length;
  }
}

class Gameboard {
  constructor(isABot) {
    this.isABot = isABot;
    this.shipCount = 5;
    [this.boardArr, this.ships] = placeShipsRandomly();
  }
  getSquareState(y, x) {
    switch (this.boardArr[y][x]) {
      case DISREGARDED:
        return "⚪";
      case HIT:
        return "🔴";
      case DAMAGED:
        return "☠️";
      default:
        return "";
    }
  }
  canBeAttacked(y, x) {
    const square = this.boardArr[y][x];
    return square !== DISREGARDED && square !== HIT && square !== DAMAGED;
  }
  markDisregarded(y, x) {
    const differenceMatrix = [
      [-1, 1],
      [1, 1],
      [1, -1],
      [-1, -1],
    ];
    const nextMoves = [];
    for (const difference of differenceMatrix) {
      const b = y + difference[0];
      const a = x + difference[1];
      if (b >= 0 && b <= 9 && a >= 0 && a <= 9) {
        if (this.boardArr[b][a] === EMPTY) {
          this.boardArr[b][a] = DISREGARDED;
        } else if (this.isABot && this.boardArr[b][a] >= 0) {
          nextMoves.push([b, a]);
        }
      }
    }
    return nextMoves;
  }
  computeNextMoves(y, x) {
    const differencesMatrix = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];
    const nextMoves = [];
    for (const [c, d] of differencesMatrix) {
      const b = y + c;
      const a = x + d;
      if (b >= 0 && b <= 9 && a >= 0 && a <= 9 && this.canBeAttacked(b, a))
        nextMoves.push([b, a]);
    }
    return nextMoves;
  }
  receiveAttack(y, x) {
    const shipIndex = this.boardArr[y][x];
    let attackResult;
    if (shipIndex >= 0) {
      this.ships[shipIndex].hit();
      this.boardArr[y][x] = DAMAGED;
      attackResult = "hit";
      if (this.ships[shipIndex].isSunk()) {
        this.shipCount--;
      }
    } else {
      this.boardArr[y][x] = HIT;
      attackResult = "miss";
    }
    const nextMoves = this.markDisregarded(y, x);
    if (this.shipCount === 0) {
      attackResult = "gameover";
    }
    return [attackResult, nextMoves];
  }
  randomize() {
    [this.boardArr, this.ships] = placeShipsRandomly();
  }
}

export default class Player {
  constructor(isABot) {
    this.board = new Gameboard(isABot);
    this.nextCpuMoves = [];
  }
  receiveAttack(y, x) {
    if (y === "random") {
      return this.#receiveCpuAttack(y, x);
    } else {
      const [attackResult] = this.board.receiveAttack(y, x);
      return attackResult;
    }
  }
  #receiveCpuAttack() {
    let keepGoing = true;
    while (keepGoing) {
      keepGoing = false;
      let x;
      let y;
      if (this.nextCpuMoves.length) {
        do {
          [y, x] = this.nextCpuMoves.pop();
        } while (!this.board.canBeAttacked(y, x));
      } else {
        do {
          x = Math.floor(Math.random() * 10);
          y = Math.floor(Math.random() * 10);
        } while (!this.board.canBeAttacked(y, x));
      }
      const [attackResult, nextDiagonalMoves] = this.board.receiveAttack(y, x);
      this.nextCpuMoves = nextDiagonalMoves.concat(this.nextCpuMoves);
      if (attackResult === "gameover") return attackResult;
      if (attackResult === "hit") {
        const nextOrthogonalMoves = this.board.computeNextMoves(y, x);
        this.nextCpuMoves = nextOrthogonalMoves.concat(this.nextCpuMoves);
        keepGoing = true;
      }
    }
  }
}
