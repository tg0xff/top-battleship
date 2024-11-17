import { Ship, EMPTY } from "./classes.js";

function makeBoardArray() {
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

function isSquareEmpty(square) {
  return square === EMPTY || square === undefined;
}

function areAdjacentSquaresEmpty(boardArr, y, x) {
  // Check every adjacent square in clockwise direction.
  const top = y === 0 || isSquareEmpty(boardArr[y - 1][x]);
  const upperRight =
    y === 0 || x === 9 || isSquareEmpty(boardArr[y - 1][x + 1]);
  const right = x === 9 || isSquareEmpty(boardArr[y][x + 1]);
  const lowerRight =
    x === 9 || y === 9 || isSquareEmpty(boardArr[y + 1][x + 1]);
  const bottom = y === 9 || isSquareEmpty(boardArr[y + 1][x]);
  const lowerLeft = y === 9 || x === 0 || isSquareEmpty(boardArr[y + 1][x - 1]);
  const left = x === 0 || isSquareEmpty(boardArr[y][x - 1]);
  const upperLeft = x === 0 || y === 0 || isSquareEmpty(boardArr[y - 1][x - 1]);
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

function checkSqrsHorizontal(boardArr, ship, n) {
  if (n === ship.length) return true;
  return (
    areAdjacentSquaresEmpty(boardArr, ship.y, ship.x + n) &&
    checkSqrsHorizontal(boardArr, ship, n + 1)
  );
}

function checkSqrsVertical(boardArr, ship, n) {
  if (n === ship.length) return true;
  return (
    areAdjacentSquaresEmpty(boardArr, ship.y + n, ship.x) &&
    checkSqrsVertical(boardArr, ship, n + 1)
  );
}

function canBePlaced(boardArr, ship) {
  if (
    boardArr[ship.y][ship.x] !== EMPTY ||
    (ship.isHorizontal ? ship.x : ship.y) + ship.length > 10
  ) {
    return false;
  }
  if (ship.isHorizontal) {
    return checkSqrsHorizontal(boardArr, ship, 0);
  } else {
    return checkSqrsVertical(boardArr, ship, 0);
  }
}

function placeShip(boardArr, ships, index, ship) {
  if (ship.isHorizontal) {
    const end = ship.x + ship.length;
    for (let i = ship.x; i < end; i++) {
      boardArr[ship.y][i] = index;
    }
  } else {
    const end = ship.y + ship.length;
    for (let i = ship.y; i < end; i++) {
      boardArr[i][ship.x] = index;
    }
  }
  ships.push(ship);
}

export default function placeShipsRandomly() {
  const ships = [];
  const boardArr = makeBoardArray();
  const shipLengths = [5, 4, 3, 3, 2];
  for (let i = 0; i < shipLengths.length; i++) {
    const ship = new Ship();
    ship.length = shipLengths[i];
    ship.isHorizontal = Math.random() > 0.5;
    do {
      ship.x = Math.floor(Math.random() * 10);
      ship.y = Math.floor(Math.random() * 10);
    } while (!canBePlaced(boardArr, ship));
    placeShip(boardArr, ships, i, ship);
  }
  return [boardArr, ships];
}
