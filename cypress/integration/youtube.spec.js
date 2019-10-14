describe('suite', () => {
    it('Realizando uma busca no wikipedia', () => {
        cy.visit('https://www.wikipedia.org/');
        cy.get('[id="searchInput"]').first().clear().type('carros');
        cy.get('i.sprite.svg-search-icon').contains('Search').click();

        cy.get('#firstHeading').should('have.text', 'Automóvel');
        
        //cy.get('#conteudo.center').contains('Usuário e/ou senha inválidos');
       // cy.xpath('//div[97]/a/div[2]/h4').first().click();
       // cy.xpath('//li[7]/a/span').first().should('have.text', 'Suporte');;
      });
});

it('Realizando duas buscas no wikipedia', () => {
    cy.visit('https://www.wikipedia.org/');
    cy.get('#searchInput').click();
    cy.get('#searchInput').clear().type('fifa');
    //cy.xpath('//form[@id="search-form"]').first().click();
    cy.xpath('//form[@id="search-form"]').first().type('{ENTER}');
    cy.get('#firstHeading').should('have.text', 'fifa');
    cy.get('#searchInput').click();
    cy.get('#searchInput').clear().type('ronaldo');
    cy.get('//input[@id="searchButton"]').click();
    cy.get('#firstHeading').should('have.text', 'Ronaldo');
    cy.xpath('//a/div').first().click();
  });