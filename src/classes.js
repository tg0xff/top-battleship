export class Ship {
  constructor(length, orientation) {
    this.length = length;
    this.hits = 0;
    this.orientation = orientation;
  }
  hit() {
    this.hits++;
  }
  isSunk() {
    return this.hits >= this.length;
  }
}

export class Gameboard {
  constructor(Ship, isHuman) {
    this.Ship = Ship;
    this.ships = [];
    this.shipCount = 5;
    this.shipIndexBoard = this.makeBoardArray(-1);
    this.hitMarks = this.makeBoardArray(false);
    if (isHuman) {
      this.placeShips();
    } else {
      this.placeShipsRandomly();
    }
  }
  makeBoardArray(initVal) {
    const board = [];
    for (let y = 0; y < 10; y++) {
      const row = [];
      for (let x = 0; x < 10; x++) {
        row[x] = initVal;
      }
      board[y] = row;
    }
    return board;
  }
  receiveAttack(y, x) {
    if (this.hitMarks[y][x]) return;
    this.hitMarks[y][x] = true;
    const shipIndex = this.shipIndexBoard[y][x];
    this.ships[shipIndex].hit();
    if (this.ships[shipIndex].isSunk()) {
      this.shipCount--;
    }
    if (this.shipCount === 0) {
      return "gameover";
    }
  }
  areAdjacentSquaresEmpty(y, x) {
    function isSquareEmpty(square) {
      return square === -1 || square === undefined;
    }
    // Check every adjacent square in clockwise direction.
    const top = y === 0 || isSquareEmpty(this.shipIndexBoard[y - 1][x]);
    const upperRight =
      y === 0 ||
      x === 9 ||
      isSquareEmpty(this.shipIndexBoard[y - 1][x + 1]);
    const right = x === 9 || isSquareEmpty(this.shipIndexBoard[y][x + 1]);
    const lowerRight =
      x === 9 ||
      y === 9 ||
      isSquareEmpty(this.shipIndexBoard[y + 1][x + 1]);
    const bottom = y === 9 || isSquareEmpty(this.shipIndexBoard[y + 1][x]);
    const lowerLeft =
      y === 9 ||
      x === 0 ||
      isSquareEmpty(this.shipIndexBoard[y + 1][x - 1]);
    const left = x === 0 || isSquareEmpty(this.shipIndexBoard[y][x - 1]);
    const upperLeft =
      x === 0 ||
      y === 0 ||
      isSquareEmpty(this.shipIndexBoard[y - 1][x - 1]);
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
      this.shipIndexBoard[ship.y][ship.x] !== -1 ||
      (ship.orientation === "h" ? ship.x : ship.y) + ship.length > 10
    ) {
      return false;
    }
    if (ship.orientation === "h") {
      return this.checkSqrsRecursivelyHorizontal(ship, 0);
    } else {
      return this.checkSqrsRecursivelyVertical(ship, 0);
    }
  }
  placeShip(index, ship) {
    if (ship.orientation === "h") {
      const end = ship.x + ship.length;
      for (let i = ship.x; i < end; i++) {
        this.shipIndexBoard[ship.y][i] = index;
      }
    } else {
      const end = ship.y + ship.length;
      for (let i = ship.y; i < end; i++) {
        this.shipIndexBoard[i][ship.x] = index;
      }
    }
  }
  placeShipsRandomly() {
    const shipLengths = [5, 4, 3, 3, 2];
    for (let i = 0; i < shipLengths.length; i++) {
      const ship = new this.Ship(shipLengths[i]);
      do {
        ship.x = Math.floor(Math.random() * 10);
        ship.y = Math.floor(Math.random() * 10);
      } while (!this.canBePlaced(ship));
      this.placeShip(i, ship);
    }
  }
  placeShips() {
    const shipLengths = [5, 4, 3, 3, 2];
    let i = 0;
    let x = 0;
    while (i < 5) {
      const ship = new this.Ship(shipLengths[i], "v");
      ship.x = x;
      ship.y = 0;
      this.placeShip(i, ship);
      i += 1;
      x += 2;
    }
  }
}

export class Player {
  constructor(isHuman, Ship, Gameboard) {
    this.isHuman = isHuman;
    this.gameboard = new Gameboard(Ship, isHuman);
  }
}
