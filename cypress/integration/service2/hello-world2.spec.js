describe("Hello World Page", () => {
  it("should load the Hello World page", () => {
    cy.visit("/");
    cy.contains("Hello World!");
  });
});
