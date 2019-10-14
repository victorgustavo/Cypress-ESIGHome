describe('suite', () => {
    it('Visitando o site do SIGAA', () => {
        cy.visit('https://testesremoto-ufg.esig.com.br/sigaa/');
        cy.get('[name="user.login"]').first().clear().type('admin');
        cy.get('[name="user.senha"]').first().clear().type('secret');
        cy.get('[value="Entrar"]').click();

        cy.get('#conteudo.center').contains('Usuário e/ou senha inválidos');
       // cy.xpath('//div[97]/a/div[2]/h4').first().click();
       // cy.xpath('//li[7]/a/span').first().should('have.text', 'Suporte');;
      });
});