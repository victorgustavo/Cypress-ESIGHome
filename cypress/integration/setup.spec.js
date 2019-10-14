
describe('Setup', () => {
    before(() => {
        cy.clearCookies();

        cy.task('seed');
        cy.task('seedOrganizacao');
    });

    it('login deve ser possível', () => {
        cy.visit('/entrar');

        cy.logar('admin@cypress.com', 'homologa17');

        cy.get('.sweet-alert')
            .contains('Parabéns!')
            .should('be.visible');
    });
});
