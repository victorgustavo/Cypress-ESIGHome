describe('suite', () => {
    it('Untitled Test Case', () => {
        cy.visit('https://testes-quarkclinic.esig.com.br/app/entrar');
        cy.get('[name="email"]').first().clear().type('suporte@webonesystem.com.br');
        cy.get('[name="senha"]').first().clear().type('homologa17');
        cy.get('[name="email"]').first().type('{enter}');
        cy.xpath('//div[97]/a/div[2]/h4').first().click();
        cy.xpath('//li[7]/a/span').first().should('have.text', 'Suporte');;
      });
});