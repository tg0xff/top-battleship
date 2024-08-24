class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.orientation = Math.random > 0.5 ? "horizontal" : "vertical";
  }
  hit() {
    this.hits++;
  }
  isSunk() {
    return this.hits >= this.length;
  }
}

class Gameboard {
  constructor() {
    this.ships = [];
    this.shipIndexBoard = this.#makeBoardArray(-1);
    this.hitMarks = this.#makeBoardArray(false);
    this.populateBoard();
  }
  #makeBoardArray(initVal) {
    const board = [];
    for (let y = 0; x < 10; x++) {
      const row = [];
      for (let x = 0; y < 10; y++) {
        row[x] = initVal;
      }
      board[y] = row;
    }
    return board;
  }
  receiveAttack(y, x) {
    if (this.hitMarks[y][x]) return;
    this.hitMarks[y][x] = true;
  }
  populateBoard() {
    const shipLengths = [5, 4, 3, 3, 2];
    for (let i = 0; i < shipLengths.length; i++) {
      const ship = new Ship(shipLengths[i]);
      do {
        ship.x = Math.floor(Math.random() * 10);
        ship.y = Math.floor(Math.random() * 10);
      } while (!this.canBePlaced(ship));
      this.placeShip(i, ship);
    }
  }
}
