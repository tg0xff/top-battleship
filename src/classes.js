class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
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
    this.hitMarks = this.#makeBoardArray(false);
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
}
