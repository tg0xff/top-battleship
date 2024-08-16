describe("Test Ship", () => {
  test("Ship.hit()", () => {
    const ship = new Ship(5);
    ship.hit();
    expect(ship.hits).toBe(4);
  });
});
