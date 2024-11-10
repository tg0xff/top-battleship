const EMPTY = -1;
const DISREGARDED = -2;
const HIT = -3;
const DAMAGED = -4;

class Ship {
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
  constructor(isHuman) {
    this.ships = [];
    this.shipCount = 5;
    if (isHuman) {
      this.placeShipsDefault();
    } else {
      this.placeShipsRandomly();
    }
  }
  makeBoardArray() {
    const board = [];
    for (let y = 0; y < 10; y++) {
      const row = [];
      for (let x = 0; x < 10; x++) {
        row[x] = EMPTY;
      }
      board[y] = row;
    }
    return board;
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
    for (const difference of differenceMatrix) {
      const b = y + difference[0];
      const a = x + difference[1];
      if (b >= 0 && b <= 9 && a >= 0 && a <= 9 && this.boardArr[b][a] === EMPTY)
        this.boardArr[b][a] = DISREGARDED;
    }
  }
  receiveAttack(y, x) {
    const shipIndex = this.boardArr[y][x];
    let returnVal;
    if (shipIndex >= 0) {
      this.ships[shipIndex].hit();
      this.boardArr[y][x] = DAMAGED;
      returnVal = "hit";
      if (this.ships[shipIndex].isSunk()) {
        this.shipCount--;
      }
    } else {
      this.boardArr[y][x] = HIT;
      returnVal = "miss";
    }
    this.markDisregarded(y, x);
    if (this.shipCount === 0) {
      returnVal = "gameover";
    }
    return returnVal;
  }
  areAdjacentSquaresEmpty(y, x) {
    function isSquareEmpty(square) {
      return square === EMPTY || square === undefined;
    }
    // Check every adjacent square in clockwise direction.
    const top = y === 0 || isSquareEmpty(this.boardArr[y - 1][x]);
    const upperRight =
      y === 0 || x === 9 || isSquareEmpty(this.boardArr[y - 1][x + 1]);
    const right = x === 9 || isSquareEmpty(this.boardArr[y][x + 1]);
    const lowerRight =
      x === 9 || y === 9 || isSquareEmpty(this.boardArr[y + 1][x + 1]);
    const bottom = y === 9 || isSquareEmpty(this.boardArr[y + 1][x]);
    const lowerLeft =
      y === 9 || x === 0 || isSquareEmpty(this.boardArr[y + 1][x - 1]);
    const left = x === 0 || isSquareEmpty(this.boardArr[y][x - 1]);
    const upperLeft =
      x === 0 || y === 0 || isSquareEmpty(this.boardArr[y - 1][x - 1]);
    return (
      top &&
      upperRight &&
      right &&
      lowerRight &&
      bottom &&
      lowerLeft &&
      left &&
      upperLeft
    );
  }
  checkSqrsRecursivelyHorizontal(ship, n) {
    if (n === ship.length) return true;
    return (
      this.areAdjacentSquaresEmpty(ship.y, ship.x + n) &&
      this.checkSqrsRecursivelyHorizontal(ship, n + 1)
    );
  }
  checkSqrsRecursivelyVertical(ship, n) {
    if (n === ship.length) return true;
    return (
      this.areAdjacentSquaresEmpty(ship.y + n, ship.x) &&
      this.checkSqrsRecursivelyVertical(ship, n + 1)
    );
  }
  canBePlaced(ship) {
    if (
      this.boardArr[ship.y][ship.x] !== EMPTY ||
      (ship.isHorizontal ? ship.x : ship.y) + ship.length > 10
    ) {
      return false;
    }
    if (ship.isHorizontal) {
      return this.checkSqrsRecursivelyHorizontal(ship, 0);
    } else {
      return this.checkSqrsRecursivelyVertical(ship, 0);
    }
  }
  placeShip(index, ship) {
    if (ship.isHorizontal) {
      const end = ship.x + ship.length;
      for (let i = ship.x; i < end; i++) {
        this.boardArr[ship.y][i] = index;
      }
    } else {
      const end = ship.y + ship.length;
      for (let i = ship.y; i < end; i++) {
        this.boardArr[i][ship.x] = index;
      }
    }
    this.ships.push(ship);
  }
  placeShipsRandomly() {
    this.ships = [];
    this.boardArr = this.makeBoardArray();
    const shipLengths = [5, 4, 3, 3, 2];
    for (let i = 0; i < shipLengths.length; i++) {
      const ship = new Ship();
      ship.length = shipLengths[i];
      ship.isHorizontal = Math.random() > 0.5;
      do {
        ship.x = Math.floor(Math.random() * 10);
        ship.y = Math.floor(Math.random() * 10);
      } while (!this.canBePlaced(ship));
      this.placeShip(i, ship);
    }
  }
  placeShipsDefault() {
    this.ships = [];
    this.boardArr = this.makeBoardArray();
    const shipLengths = [5, 4, 3, 3, 2];
    let i = 0;
    let x = 0;
    while (i < 5) {
      const ship = new Ship();
      ship.length = shipLengths[i];
      ship.isHorizontal = false;
      ship.x = x;
      ship.y = 0;
      this.placeShip(i, ship);
      i += 1;
      x += 2;
    }
  }
}

export default class Player {
  constructor(isHuman) {
    this.isHuman = isHuman;
    this.board = new Gameboard(isHuman);
  }
}
