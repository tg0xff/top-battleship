export class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.orientation = Math.random() > 0.5 ? "horizontal" : "vertical";
  }
  hit() {
    this.hits++;
  }
  isSunk() {
    return this.hits >= this.length;
  }
}

export class Gameboard {
  constructor(Ship) {
    this.Ship = Ship;
    this.ships = [];
    this.shipCount = 5;
    this.shipIndexBoard = this.makeBoardArray(-1);
    this.hitMarks = this.makeBoardArray(false);
    this.populateBoard();
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
  isSquareEmpty(square) {
    return square === -1 || square === undefined;
  }
  areAdjacentSquaresEmpty(y, x) {
    // Check every adjacent square in clockwise direction.
    return (
      this.isSquareEmpty(this.shipIndexBoard[y - 1][x]) &&
      this.isSquareEmpty(this.shipIndexBoard[y - 1][x + 1]) &&
      this.isSquareEmpty(this.shipIndexBoard[y][x + 1]) &&
      this.isSquareEmpty(this.shipIndexBoard[y + 1][x + 1]) &&
      this.isSquareEmpty(this.shipIndexBoard[y + 1][x]) &&
      this.isSquareEmpty(this.shipIndexBoard[y + 1][x - 1]) &&
      this.isSquareEmpty(this.shipIndexBoard[y][x - 1]) &&
      this.isSquareEmpty(this.shipIndexBoard[y - 1][x - 1])
    );
  }
  checkSqrsRecursivelyHorizontal(ship, n) {
    if (n > ship.length) return true;
    return (
      this.areAdjacentSquaresEmpty(ship.y, ship.x + n) &&
      this.checkSqrsRecursivelyHorizontal(ship, n + 1)
    );
  }
  checkSqrsRecursivelyVertical(ship, n) {
    if (n > ship.length) return true;
    return (
      this.areAdjacentSquaresEmpty(ship.y + n, ship.x) &&
      this.checkSqrsRecursivelyVertical(ship, n + 1)
    );
  }
  canBePlaced(ship) {
    if (
      this.shipIndexBoard[ship.y][ship.x] !== -1 ||
      (ship.orientation === "horizontal" ? ship.x : ship.y) + ship.length > 10
    ) {
      return false;
    }
    if (ship.orientation === "horizontal") {
      return this.checkSqrsRecursivelyHorizontal(ship, 0);
    } else {
      return this.checkSqrsRecursivelyVertical(ship, 0);
    }
  }
  placeShip(index, ship) {
    if (ship.orientation === "horizontal") {
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
  populateBoard() {
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
}

export class Player {
  constructor(isHuman, Ship, Gameboard) {
    this.isHuman = isHuman;
    this.gameboard = new Gameboard(Ship);
  }
}
