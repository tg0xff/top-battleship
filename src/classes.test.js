describe("Test Ship", () => {
  test("Ship.hit()", () => {
    const ship = new Ship(5);
    ship.hit();
    expect(ship.hits).toBe(4);
  });
  test("Ship.isSunk()", () => {
    const ship = new Ship(0);
    expect(ship.isSunk()).toBe(true);
  });
});

test("Gameboard.receiveAttack()", () => {
  const board = new Gameboard();
  board.receiveAttack(9, 9);
  expect(board.hitMarks[9][9]).toBe(true);
});
