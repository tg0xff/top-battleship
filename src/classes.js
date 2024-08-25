class Ship {
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

class Gameboard {
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
    const shipIndex = this.shipIndexBoard[y][x];
    this.ships[shipIndex].hit();
    if (this.ships[shipIndex].isSunk()) {
      this.shipCount--;
    }
  }
  canBePlaced(ship) {
    if (
      this.shipIndexBoard[ship.y][ship.x] !== -1 ||
      (ship.orientation === "horizontal" ? ship.x : ship.y) + ship.length > 10
    ) {
      return false;
    }

    function isSquareEmpty(square) {
      return square === -1 || square === undefined;
    }

    function areAdjacentSquaresEmpty(y, x) {
      // Check every adjacent square in clockwise direction.
      return (
        isSquareEmpty(this.shipIndexBoard[y - 1][x]) &&
        isSquareEmpty(this.shipIndexBoard[y - 1][x + 1]) &&
        isSquareEmpty(this.shipIndexBoard[y][x + 1]) &&
        isSquareEmpty(this.shipIndexBoard[y + 1][x + 1]) &&
        isSquareEmpty(this.shipIndexBoard[y + 1][x]) &&
        isSquareEmpty(this.shipIndexBoard[y + 1][x - 1]) &&
        isSquareEmpty(this.shipIndexBoard[y][x - 1]) &&
        isSquareEmpty(this.shipIndexBoard[y - 1][x - 1])
      );
    }

    function getRecursiveSqrsFn(ship) {
      function horizontal(ship, n) {
        if (n > ship.length) return true;
        return (
          areAdjacentSquaresEmpty(ship.y, ship.x + n) && horizontal(ship, n + 1)
        );
      }

      function vertical(ship, n) {
        if (n > ship.length) return true;
        return (
          areAdjacentSquaresEmpty(ship.y + n, ship.x) && vertical(ship, n + 1)
        );
      }

      return ship.orientation === "horizontal" ? horizontal : vertical;
    }

    const checkSqrsRecursively = getRecursiveSqrsFn(ship);
    return checkSqrsRecursively(ship, 0);
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

class Player {
  constructor(isHuman, Ship, Gameboard) {
    this.type = isHuman ? "player" : "cpu";
    this.gameboard = new Gameboard(Ship);
  }
}
